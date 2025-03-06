import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import usePageSEO from "@/hooks/useSEO";
import Header from "@/components/Header"; // ✅ Import Header
import Footer from "@/components/Footer"; 

export default function LandingPage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/properties");
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        const approvedProperties = data.filter((property) => property.status === "approved");

        // ✅ Randomly select 3 properties
        const shuffled = approvedProperties.sort(() => 0.5 - Math.random());
        setFeaturedProperties(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }

    fetchProperties();
  }, []);

  return (
    <div className="bg-white transition-colors duration-300">
      {/* ✅ Apply SEO Only to Landing Page */}
      {usePageSEO({
        title: "Avida Real Estate - Find Your Dream Home",
        description: "Discover the best real estate properties for sale and rent. Explore premium condos and homes in prime locations.",
        url: "http://localhost:3000/",
        image: "/seo-default-image.jpg",
      })}

      {/* ✅ Use the Header Component */}
      <Header />

      {/* ✅ HERO SECTION */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden pt-24 bg-white transition-colors duration-300">
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        >
          <source src="/Home_advertisements.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-[#990e15] bg-opacity-80"></div>

        <div className="z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white italic font-serif mb-4 drop-shadow-lg">
            Live Sure. Live Inspired.
          </h1>
          <p className="text-md md:text-lg text-gray-100 mb-6">
            Experience inspired living that is easy, distinct, and enriching.
          </p>
          <button
            onClick={() => router.push("/properties")}
            className="bg-white hover:bg-gray-200 text-[#990e15] py-3 px-6 rounded-lg font-medium transition duration-300 shadow-lg"
          >
            Browse Listings
          </button>
        </div>
      </section>

      {/* ✅ FEATURED PROPERTIES SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#990e15] mb-10">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((property, index) => (
              <div key={index} className="bg-[#990e15] text-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105">
                <img
                  src={property?.images?.length > 0 ? property.images[0] : "/default-property.jpg"}
                  alt={property.property_name || "Property Image"}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold truncate">{property.property_name}</h3>
                  <p className="text-gray-200 truncate">{property.location}</p>
                  <p className="text-lg font-bold mt-2">₱{property.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">Loading featured properties...</p>
          )}
        </div><div className="text-center mt-8">
          <button
            onClick={() => router.push("/properties")}
            className="bg-[#990e15] hover:bg-red-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-lg"
          >
            View All Properties
          </button>
        </div>
      </section>
{/* ✅ Why Choose Avida Land? Section */}
<section className="bg-gray-100 py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-[#990e15] mb-12">
          Why Choose Avida Land?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Prime Locations",
              desc: "Strategically located in key cities and provinces.",
              icon: "📍",
            },
            {
              title: "Secure & Safe",
              desc: "Gated communities with 24/7 security.",
              icon: "🛡️",
            },
            {
              title: "Premium Quality",
              desc: "Modern designs with top-notch amenities.",
              icon: "🏡",
            },
            {
              title: "Investment Opportunity",
              desc: "A great asset that increases in value over time.",
              icon: "💰",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-[#990e15]">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[#990e15] mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ✅ CALL TO ACTION */}
      <section className="bg-[#990e15] text-white text-center py-16">
        <h2 className="text-3xl font-bold">Find Your Dream Home Today!</h2>
        <p className="text-lg mt-2">Browse our available properties and book a viewing.</p>
        <button
          onClick={() => router.push("/properties")}
          className="mt-4 bg-white text-[#990e15] px-8 py-3 rounded-lg font-semibold shadow-md transition hover:bg-gray-200"
        >
          Get Started
        </button>
      </section>
      <Footer />
    </div>
  );
}
