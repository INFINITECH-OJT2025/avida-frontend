import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEOComponent from "../../src/hooks/useSEO";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MainMediaDisplay from "../../src/components/user/properties/MainMediaDisplay";
import Appointment from "../appointment";
// import { getSingleProperty } from "../../src/utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getSingleProperty, callAPI } from "../../src/utils/api";

export default function PropertyPage({ recommended }) {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id || !isClient) return;

    const fetchProperty = async () => {
      setLoading(true);
      try {
        // ✅ Get current property by ID
        const data = await getSingleProperty(id);
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Property not found.");
        }

        data.media = Array.isArray(data.media) ? data.media : [];

        // ✅ Use callAPI to fetch all properties for recommendations
        const all = await callAPI("get", "/properties");

        const recommended = all
          .filter((p) => p.id !== data.id && p.status === "approved")
          .slice(0, 3); // Limit to 3 recommendations

        data.recommended = recommended;

        setProperty(data);

        // ✅ Set default preview image
        if (data.media.length > 0) {
          setSelectedMedia(data.media[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty(); // ✅ CALL the function
  }, [id, isClient]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₱0.00";
    return `₱${parseFloat(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (!isClient) return <p className="text-center text-gray-600 mt-10">Initializing...</p>;
  if (loading) return <p className="text-center text-gray-600 mt-10">Loading property details...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (

    <div className="dark:bg-gray-900">
      <SEOComponent />
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-20 bg-gray-100 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Property Media & Title */}
          <div>
            <h1 className="text-4xl font-extrabold text-[#990e15]">{property.property_name}</h1>
            <p className="text-lg text-gray-500 mt-2">{property.location}</p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {/* Interactive Preview */}
              <div className="w-full">
                {/* Large Preview */}
                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md bg-black mb-4">
                  {selectedMedia?.type === "video" ? (
                    <video
                      src={selectedMedia.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedMedia.url}
                      alt={`${property.property_name} Preview`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Thumbnail Swiper */}
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
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedMedia.url === media.url
                          ? "border-[#990e15]"
                          : "border-transparent"
                          }`}
                      >
                        {media.type === "video" ? (
                          <video
                            src={media.url}
                            muted
                            className="w-full h-[120px] object-cover"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-[120px] object-cover"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>


            </div>
          </div>

          {/* Right: Property Details + Appointment */}
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md flex flex-col space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-[#990e15]">Property Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <p><strong>Unit Type:</strong> {property.unit_type}</p>
                <p><strong>Unit Status:</strong> {property.unit_status}</p>
                <p><strong>Price:</strong> {formatCurrency(property.price)}</p>
                <p><strong>Size:</strong> {property.square_meter} sqm.</p>
                <p><strong>Floor Number:</strong> {property.floor_number} floor/s</p>
                <p><strong>Parking:</strong> {property.parking}</p>
                <p><strong>Property Status:</strong> {property.property_status}</p>
                <div>
                  <strong>Features & Amenities:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700 dark:text-gray-300">
                    {(() => {
                      try {
                        const amenities = property.features_amenities ? JSON.parse(property.features_amenities) : [];
                        return amenities.length > 0
                          ? amenities.map((item, i) => <li key={i}>{item}</li>)
                          : <li>None</li>;
                      } catch {
                        return <li>Invalid format</li>;
                      }
                    })()}
                  </ul>
                </div>

              </div>

              <div className="border-l pl-6">
                <h3 className="text-xl font-semibold text-[#990e15] mb-2">Book an Appointment</h3>
                <Appointment />
              </div>
            </div>


          </div>
        </div>


        <div className="mt-6 text-center bg-gray-100 p-5 rounded-lg shadow-md dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-[#990e15]">Looking for More Options?</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Explore a wide range of premium properties suited for your lifestyle.
            Find your dream home today!
          </p>
          {/* Recommended Properties */}
          <h2 className="text-3xl font-bold text-[#990e15] text-center">Recommended Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {property?.recommended?.map((rec) => (

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
                  <h3 className="text-lg text-left font-semibold text-[#990e15] truncate">
                    {rec.unit_type} | {rec.property_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left truncate">{rec.location}</p>
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
  );
}