import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch Approved Properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/properties");
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();

        // ✅ Filter only approved properties
        const publishedProperties = data.filter(property => property.status === "approved");
        setProperties(publishedProperties);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading properties...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-[#990e15]">PROPERTIES</h1>
        <p className="text-lg text-gray-600 mt-2">
          Discover the perfect property with unmatched quality, dedication, and personalized guidance.
        </p>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/property/${property.id}`)}
          >
            {/* Property Image */}
            <div className="relative">
            <img 
              src={property.images[0]} 
              alt={property.property_name} 
              className="w-full h-56 object-cover"
            />

              {/* Overlay for "For Sale" / "For Rent" */}
              <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-full ${
                property.property_status === "For Sale" ? "bg-[#990e15] text-white" : "bg-blue-500 text-white"
              }`}>
                {property.property_status}
              </span>
            </div>

            {/* Property Info */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-[#990e15] truncate">{property.unit_type} | {property.property_name}</h2>
              <p className="text-gray-600 truncate">{property.location}</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">₱{property.price.toLocaleString()}</p>

              {/* Tags */}
              <div className="flex flex-wrap mt-2 gap-2">
                <span className="px-3 py-1 text-xs font-semibold bg-[#990e15] text-white rounded-full">
                  {property.unit_status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
