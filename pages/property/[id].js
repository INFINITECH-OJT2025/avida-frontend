import useSEO from "@/hooks/useSEO";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // ✅ Prevents hydration mismatch

  // ✅ Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id || !isClient) return; // ✅ Prevent running SSR fetch

    async function fetchProperty() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/properties/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) throw new Error("Property not found");

        setProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id, isClient]);

  // ✅ Prevent hydration errors by ensuring client-side rendering
  if (!isClient) return <p className="text-center text-gray-600 mt-10">Initializing...</p>;

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading property details...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <>
      {useSEO({
        title: `${property.property_name} - Buy or Rent | Avida Land`,
        description: `${property.property_name} located in ${property.location}. Price: ₱${property.price.toLocaleString()}.`,
        url: `http://localhost:3000/property/${id}`,
        image: property.images.length > 0 ? `/storage/${property.images[0]}` : "/default-property.jpg",
      })}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#6C2BD9]">{property.property_name}</h1>
        <p className="text-lg text-gray-600 mt-2">{property.location}</p>

        {/* Property Image */}
        <div className="mt-6">
        <img src={property.images[0]} alt={property.property_name} className="w-full h-96 object-cover rounded-lg shadow-md" />
        </div>

        {/* Property Information */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#6C2BD9]">Property Details</h2>
          <p className="text-lg text-gray-700 mt-2">
            <strong>Type:</strong> {property.unit_type} <br />
            <strong>Status:</strong> {property.unit_status} <br />
            <strong>Price:</strong> ₱{property.price.toLocaleString()} <br />
            <strong>Size:</strong> {property.square_meter} sqm <br />
            <strong>Floor Number:</strong> {property.floor_number} <br />
            <strong>Parking:</strong> {property.parking} <br />
            <strong>Status:</strong> {property.property_status} <br />
          </p>
        </div>
      </div>
    </>
  );
}
