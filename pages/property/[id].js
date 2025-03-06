import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import useSEO from "@/hooks/useSEO";
import "lightbox2/dist/css/lightbox.min.css";
import PhotoSphere from "@/components/PhotoSphere"; 
import Header from "@/components/Header"; 


export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id || !isClient) return;

    async function fetchProperty() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/properties/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        console.log("Fetched Property Data:", data);

        if (!data || Object.keys(data).length === 0)
          throw new Error("Property not found");

        // ✅ Ensure media array exists
        data.media = Array.isArray(data.media) ? data.media : [];
        setProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id, isClient]);

  if (!isClient) return <p className="text-center text-gray-600 mt-10">Initializing...</p>;
  if (loading) return <p className="text-center text-gray-600 mt-10">Loading property details...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <>
      {useSEO({
        title: `${property.property_name} - Buy or Rent | Avida Land`,
        description: `${property.property_name} located in ${property.location}. Price: ₱${property.price.toLocaleString()}.`,
        url: `http://localhost:3000/property/${id}`,
        image: property.media.length > 0 ? property.media[0].url : "/default-property.jpg",
      })}

      <div className="max-w-7xl mx-auto px-6 py-20">
        <Header />
        {/* ✅ Property Name & Location */}
        <h1 className="text-4xl font-extrabold text-[#990e15]">{property.property_name}</h1>
        <p className="text-lg text-gray-500 mt-2">{property.location}</p>

        {/* ✅ Property Media Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ✅ Main Media Display */}
          <div>
            {property.media.length > 0 ? (
              property.media[0].type === "video" ? (
                <video
                  src={property.media[0].url}
                  controls
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                />
              ) : (
                <a href={property.media[0].url} data-lightbox="property-gallery">
                  <img
                    src={property.media[0].url}
                    alt={property.property_name}
                    className="w-full h-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
                  />
                </a>
              )
            ) : (
              <img
                src="/default-property.jpg"
                alt="No Image Available"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* ✅ Additional Media Gallery */}
          <div className="grid grid-cols-2 gap-4">
            {property.media.length > 1 ? (
              property.media.slice(1).map((media, index) => (
                media.type === "video" ? (
                  <video
                    key={index}
                    src={media.url}
                    controls
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <a key={index} href={media.url} data-lightbox="property-gallery">
                    <img
                      src={media.url}
                      className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                    />
                  </a>
                )
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No additional media</p>
            )}
          </div>
        </div>

        {/* ✅ Virtual Tour Link (If available) */}
        {property.virtual_tour_link && (
          <div className="mt-6 text-center">
            <a
              href={property.virtual_tour_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#990e15] text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-lg hover:bg-red-800"
            >
              View Virtual Tour
            </a>
          </div>
        )}

        {/* ✅ Property Details Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#990e15]">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-lg text-gray-700">
            <p><strong>Type:</strong> {property.unit_type}</p>
            <p><strong>Status:</strong> {property.unit_status}</p>
            <p><strong>Price:</strong> ₱{property.price.toLocaleString()}</p>
            <p><strong>Size:</strong> {property.square_meter} sqm</p>
            <p><strong>Floor Number:</strong> {property.floor_number}</p>
            <p><strong>Parking:</strong> {property.parking}</p>
            <p><strong>Property Status:</strong> {property.property_status}</p>
            <p><strong>Features & Amenities:</strong> {property.features_amenities ? JSON.parse(property.features_amenities).join(", ") : "None"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
