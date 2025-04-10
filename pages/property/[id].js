import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEOComponent from "../../src/hooks/useSEO";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MainMediaDisplay from "../../src/components/user/properties/MainMediaDisplay";
import Appointment from "../appointment";
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
  const [isClient, setIsClient] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id || !isClient) return;

    const fetchProperty = async () => {
      try {
        const data = await getSingleProperty(id);
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Property not found.");
        }

        data.media = Array.isArray(data.media) ? data.media : [];

        const all = await callAPI("get", "/properties");
        const recommended = Array.isArray(all)
          ? all.filter((p) => p.id !== data.id && p.status === "approved").slice(0, 3)
          : [];

        data.recommended = recommended;

        setProperty(data);

        if (data.media.length > 0) {
          setSelectedMedia(data.media[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch property details.");
      }
    };
    fetchProperty();
  }, [id, isClient]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₱0.00";
    return `₱${parseFloat(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!property) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="dark:bg-gray-900">
      <SEOComponent />
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-20 bg-gray-100 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-[#990e15]">
              {property.property_name || 'N/A'}
            </h1>
            <p className="text-lg text-gray-500 mt-2">{property.location || 'Unknown location'}</p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="w-full">
                <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md bg-black mb-4">
                  {selectedMedia?.type === "video" ? (
                    <video
                      src={selectedMedia?.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedMedia?.url}
                      alt={`${property.property_name || 'Property'} Preview`}
                      className="w-full h-full object-cover"
                    />
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
                  {Array.isArray(property.media) && property.media.map((media, index) => (
                    <SwiperSlide key={index}>
                      <div
                        onClick={() => setSelectedMedia(media)}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedMedia?.url === media.url
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

          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md flex flex-col space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-[#990e15]">Property Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md text-gray-700 dark:text-gray-300">
              <div className="space-y-2">
                <p><strong>Unit Type:</strong> {property.unit_type || 'N/A'}</p>
                <p><strong>Unit Status:</strong> {property.unit_status || 'N/A'}</p>
                <p><strong>Price:</strong> {formatCurrency(property.price)}</p>
                <p><strong>Size:</strong> {property.square_meter || 0} sqm.</p>
                <p><strong>Floor Number:</strong> {property.floor_number || 'N/A'} floor/s</p>
                <p><strong>Parking:</strong> {property.parking || 'None'}</p>
                <p><strong>Property Status:</strong> {property.property_status || 'N/A'}</p>
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
          <h2 className="text-3xl font-bold text-[#990e15] text-center">Recommended Properties</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
            Explore a wide range of premium properties suited for your lifestyle.
            Find your dream home today!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {Array.isArray(property.recommended) && property.recommended.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/property/${rec.id}`)}
              >
                <img
                  src={rec.media?.[0]?.url || "/default-property.jpg"}
                  alt={rec.property_name || "Recommended Property"}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg text-left font-semibold text-[#990e15] truncate">
                    {rec.unit_type || "Unit"} | {rec.property_name || "Property"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left truncate">{rec.location || 'Unknown'}</p>
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
