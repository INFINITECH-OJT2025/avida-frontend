import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEOComponent from "../../src/hooks/useSEO";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import Appointment from "../appointment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { callAPI } from "../../src/utils/api";
import Head from "next/head";

export default function PropertyPage({ property, recommended }) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState(property.media?.[0] ?? null);

  useEffect(() => {
    setSelectedMedia(property.media?.[0] ?? null);
  }, [property]);

  useEffect(() => {
    if (property?.property_name) {
      document.title = `${property.property_name} | Avida Land`;
    }
  }, [property?.property_name]);

  const dynamicSEO = {
    title: `${property.property_name} - Avida Land`,
    description: `Located in ${property.location}, this ${property.unit_type} is now available for ${property.property_status}.`,
    image: property.media?.[0]?.url ?? "/default-property.jpg",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/property/${property.id}`,
  };
  console.log("SEO Title:", property.property_name);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₱0.00";
    return `₱${parseFloat(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (router.isFallback || !property) {
    return <p className="text-center text-gray-600 mt-10">Loading property details...</p>;
  }

  return (
    
    <>
<Head>
  <title>{property?.property_name} - Manual Test</title>
</Head>

{property?.property_name && (
  
  <SEOComponent
    dynamicData={{
      title: `${property.property_name} - Avida Land`,
      description: `Located in ${property.location}, this ${property.unit_type} is now available for ${property.property_status}.`,
      image: property.media?.[0]?.url ?? "/default-property.jpg",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/property/${property.id}`,
    }}
  />
)}

      <div className="dark:bg-gray-900">
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-20 bg-gray-100 dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Property Media & Title */}
            <div>
              <h1 className="text-4xl font-extrabold text-[#990e15]">{property.property_name}</h1>
              <p className="text-lg text-gray-500 mt-2">{property.location}</p>

              <div className="mt-6">
                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md bg-black mb-4">
                  {selectedMedia?.type === "video" ? (
                    <video src={selectedMedia.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={selectedMedia.url} alt="Selected Media" className="w-full h-full object-cover" />
                  )}
                </div>

                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={12}
                  slidesPerView={3}
                  navigation
                  pagination={{ clickable: true }}
                  className="rounded-md"
                >
                  {property.media.map((media, index) => (
                    <SwiperSlide key={index}>
                      <div
                        onClick={() => setSelectedMedia(media)}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                          selectedMedia.url === media.url ? "border-[#990e15]" : "border-transparent"
                        }`}
                      >
                        {media.type === "video" ? (
                          <video src={media.url} muted className="w-full h-[120px] object-cover" />
                        ) : (
                          <img src={media.url} alt={`Media ${index + 1}`} className="w-full h-[120px] object-cover" />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Property Details + Appointment */}
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md flex flex-col space-y-6 w-full">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md text-gray-700 dark:text-gray-300">
                <div className="space-y-2"><h2 className="text-2xl font-semibold text-[#990e15]">Property Details</h2>
                  <p><strong>Unit Type:</strong> {property.unit_type}</p>
                  <p><strong>Unit Status:</strong> {property.unit_status}</p>
                  <p><strong>Price:</strong> {formatCurrency(property.price)}</p>
                  <p><strong>Size:</strong> {property.square_meter} sqm.</p>
                  <p>
  <strong>Floor Number:</strong> {property.floor_number}{" "}
  {property.floor_number > 1 ? "floors" : "floor"}
</p>

                  <p><strong>Parking:</strong> {property.parking}</p>
                  <p><strong>Property Status:</strong> {property.property_status}</p>
                  <p><strong>Features & Amenities:</strong></p>
<ul className="list-disc list-inside ml-4 mt-1">
  {property.features_amenities && Array.isArray(JSON.parse(property.features_amenities)) ? (
    JSON.parse(property.features_amenities).map((item, index) => (
      <li key={index}>{item}</li>
    ))
  ) : (
    <li>None</li>
  )}
</ul>

                </div>

                <div className="border-l pl-6">
                  <h3 className="text-xl font-semibold text-[#990e15] mb-2">Book an Appointment</h3>
                  <Appointment />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Properties */}
          <div className="mt-10 bg-gray-100 p-5 rounded-lg shadow-md dark:bg-gray-900">
            <h2 className="text-3xl font-bold text-[#990e15] text-center">Recommended Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {recommended.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/property/${rec.id}`)}
                >
                  <img
                    src={rec.media?.[0]?.url ?? "/default-property.jpg"}
                    alt={rec.property_name}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#990e15] truncate">
                      {rec.unit_type} | {rec.property_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{rec.location}</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white mt-1 flex justify-between items-center">
  <span>{formatCurrency(rec.price)}</span>
  {rec.square_meter && (
    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
      {parseFloat(rec.square_meter)} sqm.
    </span>
  )}
</p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const property = await callAPI("get", `/properties/${params.id}`);
    const all = await callAPI("get", "/properties");

    const recommended = all
      .filter((p) => p.id !== property.id && p.status === "approved")
      .slice(0, 3);

    return { props: { property, recommended } };
  } catch {
    return { notFound: true };
  }
}
