import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header"; // ✅ Import Header

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    priceRange: "all",
    propertyStatus: "all",
    unitType: "all",
  });

  const router = useRouter();

  // ✅ Fetch Approved Properties
  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/properties");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log("Fetched properties:", data);

      const formattedProperties = data.map((property) => ({
        ...property,
        images: typeof property.images === "string" ? JSON.parse(property.images) : property.images || [],
      }));

      setProperties(formattedProperties);
      setFilteredProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ✅ Apply Filters on Button Click
  const applyFilters = (updatedFilters) => {
    let filtered = properties.filter(
      (property) =>
        property.property_name.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase()) ||
        property.price.toString().includes(updatedFilters.searchTerm) ||
        property.unit_type.toLowerCase().includes(updatedFilters.searchTerm)
    );
  
    if (updatedFilters.priceRange !== "all") {
      const [min, max] = updatedFilters.priceRange.split("-").map(Number);
      filtered = filtered.filter((property) => property.price >= min && property.price <= max);
    }
    if (updatedFilters.propertyStatus !== "all") {
      filtered = filtered.filter((property) => property.property_status === updatedFilters.propertyStatus);
    }
    if (updatedFilters.unitType !== "all") {
      filtered = filtered.filter((property) => property.unit_type === updatedFilters.unitType);
    }
  
    setFilteredProperties(filtered);
  };
  

  // ✅ Handle Input Changes Without Instant Filteringconst handleFilterChange = (type, value) => {
    const handleFilterChange = (type, value) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, [type]: value };
        applyFilters(updatedFilters);  // ✅ Apply filters immediately
        return updatedFilters;
      });
    };
    


  if (loading) return <p className="text-center text-gray-600 mt-10">Loading properties...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    
    <div className="bg-gray-100 min-h-screen">
<Header />
      {/* Hero Section */}
      <div className="relative bg-[#990e15] text-white py-16 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold">FIND YOUR DREAM PROPERTY</h1>
          <p className="text-lg text-gray-200 mt-3">Search by name, location, price, and more.</p>

          {/* 🔹 Search Bar + Search Button */}
          <div className="mt-6 flex justify-center gap-2">
            <input
              type="text"
              placeholder="Search properties..."
              className="p-3 w-full sm:w-1/2 border rounded-lg text-gray-700"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <button
              onClick={applyFilters}
              className="bg-[#990e15] text-white px-6 py-3 rounded-lg font-bold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Filter Bar */}
      <div className="bg-white shadow-md py-4 px-6 flex flex-wrap justify-center gap-4 border-b">
        <select className="p-3 border rounded-lg" onChange={(e) => handleFilterChange("priceRange", e.target.value)}>
          <option value="all">All Prices</option>
          <option value="0-5000000">₱0 - ₱5M</option>
          <option value="5000001-10000000">₱5M - ₱10M</option>
          <option value="10000001-20000000">₱10M - ₱20M</option>
          <option value="20000001-30000000">₱20M - ₱30M</option>
          <option value="30000001-40000000">₱30M - ₱40M</option>
          <option value="40000001-50000000">₱40M - ₱50M</option>
          <option value="50000001-60000000">₱50M - ₱60M</option>
          <option value="60000001-70000000">₱60M - ₱70M</option>
          <option value="70000001-80000000">₱70M - ₱80M</option>
          <option value="80000001-90000000">₱80M - ₱90M</option>
          <option value="90000001-100000000">₱90M - ₱100M</option>
          <option value="100000001-500000000">₱100M - ₱500M</option>
        </select>
        <select className="p-3 border rounded-lg" onChange={(e) => handleFilterChange("propertyStatus", e.target.value)}>
          <option value="all">All Status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>
        <select className="p-3 border rounded-lg" onChange={(e) => handleFilterChange("unit_type", e.target.value)}>
          <option value="all">All Unit Types</option>
          <option value="Studio Room">Studio Room</option>
          <option value="1BR">1-Bedroom</option>
          <option value="2BR">2-Bedroom</option>
          <option value="3BR">3-Bedroom</option>
          <option value="Loft">Loft</option>
          <option value="Penthouse">Penthouse</option>
        </select>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#990e15] text-center">Available Properties</h2>
        <p className="text-center text-gray-600 mt-2">
          Browse through our collection of premium real estate listings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-105"
                onClick={() => router.push(`/property/${property.id}`)}
              >
                {/* Property Media (Image or Video) */}
                <div className="relative">
                  {/* ✅ Check if images exist and format the correct URL */}
                  {property.images.length > 0 && isVideo(property.images[0]) ? (
                    <video
                      src={`http://127.0.0.1:8000/storage/${property.images[0]}`} // ✅ Correct Storage URL
                      className="w-full h-56 object-cover"
                      controls
                      loop
                      muted
                      onMouseOver={(e) => e.target.play()} // ✅ Auto-play on hover
                      onMouseOut={(e) => e.target.pause()}
                    />
                  ) : (
                    <img
                      src={property.images.length > 0 ? `http://127.0.0.1:8000/storage/${property.images[0]}` : "/default-property.jpg"}
                      alt={property.property_name}
                      className="w-full h-56 object-cover"
                    />

                  )}


                  {/* Overlay for "For Sale" / "For Rent" */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-full ${property.property_status === "For Sale"
                      ? "bg-[#990e15] text-white"
                      : "bg-blue-500 text-white"
                      }`}
                  >
                    {property.property_status}
                  </span>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-[#990e15] truncate">
                    {property.unit_type} | {property.property_name}
                  </h2>
                  <p className="text-gray-600 truncate">{property.location}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    ₱{property.price.toLocaleString()}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap mt-2 gap-2">
                    <span className="px-3 py-1 text-xs font-semibold bg-[#990e15] text-white rounded-full">
                      {property.unit_status}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">
                      {property.floor_number} Floor
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">
                      {property.square_meter} sqm
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              No properties found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#990e15] text-white text-center py-12">
        <h2 className="text-3xl font-bold">Interested in listing your property?</h2>
        <p className="text-lg text-gray-200 mt-2">Join thousands of property owners who trust us.</p>
        <button
          onClick={() => router.push("/submit-property")}
          className="mt-4 px-6 py-3 bg-white text-[#990e15] font-semibold rounded-lg"
        >
          List Your Property
        </button>
      </div>
    </div>
  );
}
