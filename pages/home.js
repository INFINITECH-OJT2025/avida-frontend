import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import usePageSEO from "../src/hooks/useSEO";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import ContactInquiry from "../src/components/user/services/contact-us";
import { callAPI } from "../src/utils/api"; // ✅ Import API utility
import SEOComponent from "../src/hooks/useSEO";

export default function LandingPage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await callAPI("get", "/properties");
  
        const approvedProperties = data.filter(
          (property) => property.status === "approved"
        );
  
        const storedData = JSON.parse(localStorage.getItem("featured_properties"));
        const lastShuffled = localStorage.getItem("shuffle_timestamp");
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
        const now = Date.now();
  
        // ✅ Reuse cached shuffle if within 1 week
        if (storedData && lastShuffled && now - lastShuffled < oneWeek) {
          setFeaturedProperties(storedData);
        } else {
          // ✅ Shuffle array
          const shuffled = approvedProperties
            .map((item) => ({ item, sort: Math.random() })) // assign random sort key
            .sort((a, b) => a.sort - b.sort) // sort randomly
            .map(({ item }) => item); // extract back the original array
  
          const limited = shuffled.slice(0, 3); // ✅ Limit to 3
  
          setFeaturedProperties(limited);
          localStorage.setItem("featured_properties", JSON.stringify(limited));
          localStorage.setItem("shuffle_timestamp", now);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
  
    fetchProperties();
  }, []);
  

  const getPropertyImage = (property) => {
    if (property.property_panorama_images?.length > 0) {
      return property.property_panorama_images[0];
    } else if (property.property_lightbox_media?.length > 0) {
      return property.property_lightbox_media[0];
    }
    return "/default-property.jpg";
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* {isHydrated &&
        usePageSEO({
          title: "Avida Real Estate - Find Your Dream Home",
          description: "Discover the best real estate properties for sale and rent.",
          url: "http://localhost:3000/",
          image: "/seo-default-image.jpg",
        })} */}
      <SEOComponent />
      <Header />

      {/* ✅ HERO SECTION */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden pt-20 bg-background">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
          <source src="/Home_ads.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white italic font-serif mb-4">
            Live Sure. Live Inspired.
          </h1>
          <p className="text-md md:text-lg text-gray-100 mb-6">
            Experience inspired living that is easy, distinct, and enriching.
          </p>
          <button
            onClick={() => router.push("/properties")}
            className="bg-white hover:bg-gray-200 text-primary py-3 px-6 rounded-lg font-medium transition duration-300"
          >
            Browse Listings
          </button>
        </div>
      </section>

      {/* ✅ FEATURED PROPERTIES SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isHydrated ? (
            featuredProperties.length > 0 ? (
              featuredProperties.map((property, index) => (
                <div key={index} className="bg-card text-text rounded-lg shadow-md overflow-hidden">
                  <img
                    src={
                      property.media?.length > 0
                        ? property.media[0].url
                        : "/default-property.jpg"
                    }
                    alt={property.property_name || "Property Image"}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold truncate">{property.property_name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 truncate">{property.location}</p>
                    <p>
                      ₱
                      {parseFloat(property.price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 col-span-3">
                No properties found.
              </p>
            )
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-3">
              Loading featured properties...
            </p>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/properties")}
            className="bg-primary hover:bg-red-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-lg"
          >
            View All Properties
          </button>
        </div>
      </section>

      {/* ✅ CALL TO ACTION */}
      <section className="bg-[#990e15] text-white py-16 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Join Our Team & Build Your Career!</h2>
        <p className="text-lg text-gray-200 mb-6">
          Explore exciting job opportunities and grow with us. Your future starts here.
        </p>
        <button
          onClick={() => router.push("/careers")}
          className="mt-4 bg-white text-[#990e15] px-8 py-3 rounded-lg font-semibold shadow-md transition hover:bg-gray-200"
        >
          View Job Openings
        </button>
      </section>

      {/* ✅ CONTACT INQUIRY */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 px-2 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Contact us</h2>
          <ContactInquiry />
        </div>
      </section>

      <Footer />
    </div>
  );
}
