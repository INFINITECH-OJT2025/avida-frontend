import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import UsePageSEO from "../src/hooks/useSEO";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Image from "next/image";


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
  const API_BASE_URL = "http://127.0.0.1:8000"; // ✅ API Base URL

  // ✅ Fetch Approved Properties
  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log("Fetched properties:", data);

      const formattedProperties = data.map((property) => ({
        ...property,
        images: property.media.map((media) =>
          media.url.startsWith("http") ? media.url : `${API_BASE_URL}${media.url}`
        ),
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

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [type]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading properties...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <UsePageSEO/>
      <Header />

      {/* Hero Section */}
      <div className="relative bg-[#990e15] text-white py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold">FIND YOUR DREAM PROPERTY</h1>
          <p className="text-lg text-gray-200 mt-3">Search by name, location, price, and more.</p>

          {/* 🔹 Search Bar */}
          <div className="mt-6 flex justify-center gap-2">
            <input
              type="text"
              placeholder="Search properties..."
              className="p-3 w-full sm:w-1/2 border rounded-lg text-gray-700 dark:bg-gray-800 dark:text-white"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <button
              onClick={() => applyFilters(filters)}
              className="bg-[#990e15] text-white px-6 py-3 rounded-lg font-bold"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* 🔹 Filter Bar (Fixed for Dark Mode) */}
      <div className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex flex-wrap justify-center gap-4 border-b dark:border-gray-600">
        <select className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
        >
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

        <select className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          onChange={(e) => handleFilterChange("propertyStatus", e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>

        <select className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          onChange={(e) => handleFilterChange("unitType", e.target.value)}
        >
          <option value="all">All Unit Types</option>
          <option value="Studio Room">Studio Room</option>
          <option value="1BR">1-Bedroom</option>
          <option value="2BR">2-Bedroom</option>
          <option value="3BR">3-Bedroom</option>
          <option value="Loft">Loft</option>
          <option value="Penthouse">Penthouse</option>
        </select>
      </div>

      {/* 🔹 Property Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#990e15] text-center">Available Properties</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
          Browse through our collection of premium real estate listings.
        </p>
        <div className="flex justify-end my-4">
          <button
            onClick={() => router.push("/property/property-comparison")}
            className="bg-[#990e15] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#990e15] transition"
          >
            Compare Properties
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="relative bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:scale-105 w-full max-w-[350px]"
                onClick={() => router.push(`/property/${property.id}`)}
              >
                {/* ✅ Property Image Handling */}
                <div className="relative h-39">
                  {property.images && property.images.length > 0 && property.images[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.property_name || "Property Image"}
                      width={350}
                      height={300}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* ✅ Property Status Badge */}
                <span
                  className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold uppercase rounded-md ${property.property_status === "For Sale"
                      ? "bg-[#990e15] text-white"
                      : "bg-blue-500 text-white"
                    }`}
                >
                  {property.property_status}
                </span>

                {/* ✅ Property Info */}
                <div className="p-3">
                  <h2 className="text-base font-bold text-[#990e15] truncate">
                    {property.unit_type} | {property.property_name}
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{property.location}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(property.price)}
                  </p>

                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300 col-span-3">
              No properties found matching your search.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
