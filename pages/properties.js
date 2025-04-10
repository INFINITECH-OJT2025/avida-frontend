import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import SEOComponent from "../src/hooks/useSEO";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Image from "next/image";
import { Search, X, Download, Plus } from "lucide-react";
import { useToast } from "../src/context/ToastContext"; // ✅ import toast
import "lightbox2/dist/css/lightbox.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { exportComparisonToPDF } from "../src/components/pdf/ExportComparisonPDF";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    priceRange: "all",
    propertyStatus: "all",
    unitType: "all",
  });
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();
  // const API_BASE_URL = "https://infinitech-api3.site";

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();

      const formattedProperties = data.map((property) => ({
        ...property,
        images: property.media.map((media) => media.url)
      }));

      setProperties(formattedProperties);
      setFilteredProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
    } finally {
       
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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

  const toggleCompare = (property) => {
    setSelectedProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);

      if (exists) {
        showToast("Removed from comparison", "info");
        return prev.filter((p) => p.id !== property.id);
      }

      if (prev.length < 4) {
        showToast("Added to comparison", "success");
        return [...prev, property];
      }

      showToast("You can only compare up to 4 properties.", "warning");
      return prev;
    });
  };

  const clearComparison = () => {
    setSelectedProperties([]);
    setShowComparison(false);
    showToast("Comparison list cleared.", "info");
  };

  const exportToPDF = () => {
    const modalElement = document.getElementById("comparison-modal");
    if (!modalElement) return;

    html2canvas(modalElement, { scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("property-comparison.pdf");
    });
  };


  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <SEOComponent />
      <Header />

      {/* Hero Section */}
      <div className="relative bg-[#990e15] text-white py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mt-16 ">Find Your Dream Property</h1>
          <p className="text-base md:text-lg text-gray-200 mt-2">Search by name, location, price, and more.</p>

          {/* 🔹 Search Bar with Icon */}
          <div className="mt-4 flex justify-center gap-2 relative w-full sm:w-2/3 md:w-1/2 mx-auto">
            <input
              type="text"
              placeholder="Search properties..."
              className="p-2 pl-4 pr-10 w-full border rounded-lg text-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-gray-300 outline-none"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="relative bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:scale-105 w-full max-w-[350px]"
                onClick={() => router.push(`/property/${property.id}`)}
              >
                <div className="relative w-full h-[220px] overflow-hidden">
                <Image
src={property.media[0].url}
  alt={property.property_name || "Property Image"}
  width={350}
  height={220}
  className="w-full h-full object-cover rounded-t-lg"
  onError={(e) => {
    e.target.src = "/fallback.jpg"; // Add a fallback image in /public
  }}
/>


                  {/* ✅ Updated Comparison Button with X icon */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(property);
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all
                    ${selectedProperties.find((p) => p.id === property.id)
                          ? "bg-[#990e15] text-white"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                    >
                      {selectedProperties.find((p) => p.id === property.id) ? (
                        <X size={18} />
                      ) : (
                        <Plus size={22} strokeWidth={3} /> // 👈 More prominent icon
                      )}
                    </button>
                  </div>
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
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1 flex justify-between items-center">
                    <span>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(property.price)}
                    </span>
                    {property.square_meter && (
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                        {parseFloat(property.square_meter)} sqm.
                      </span>
                    )}
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

      {/* ✅ Show Compare button only when 2 or more properties are selected */}
      {selectedProperties.length >= 2 && (
        <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border dark:border-gray-700">
          <button
            className="bg-[#990e15] text-white px-6 py-2 rounded-lg font-bold"
            onClick={() => setShowComparison(true)}
          >
            Compare ({selectedProperties.length})
          </button>
          <button
            className="ml-3 text-sm text-gray-600 dark:text-gray-300 underline"
            onClick={() => setSelectedProperties([])}
          >
            Clear
          </button>
        </div>
      )}

      {/* Property Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="comparison-modal"
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90vw] max-w-6xl h-[85vh] overflow-auto relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4 mb-4">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#990e15] flex items-center gap-2">
                  <span className="text-2xl">📊</span> Property Comparison
                </h2>
                <button
                  onClick={clearComparison}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="text-gray-800 dark:text-white w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm dark:text-white">
                  <thead className="bg-[#990e15] text-white">
                    <tr>
                      <th className="p-3">Feature</th>
                      {selectedProperties.map((p, index) => (
                        <th
                          key={p.id}
                          className={`p-3 text-center whitespace-nowrap border-l ${index !== 0 ? 'border-gray-300 dark:border-gray-700' : ''}`}
                        >
                          {p.property_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                    {selectedProperties.length > 0 && (
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <td className="p-2 font-bold">📷 Images / Media</td>
                        {selectedProperties.map((p, index) => (
                          <td
                            key={p.id}
                            className={`p-2 border-l ${index !== 0 ? 'border-gray-300 dark:border-gray-700' : ''}`}
                          >
                            <div className="flex justify-center gap-2">
                              {p.media
                                .filter((media) => media.type === "image")
                                .slice(0, 3)
                                .map((media, idx) => (
                                  <a href={media.url} data-lightbox={`property-gallery-${p.id}`}>
                                    <Image
                                      src={media.url}
                                      alt={`Image ${idx + 1}`}
                                      width={80}
                                      height={80}
                                      className="rounded-md object-cover border w-[80px] h-[80px] cursor-pointer"
                                      loading="lazy"
                                    />
                                  </a>

                                ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )}

                    {["price", "location", "unit_status", "unit_type", "square_meter", "floor_number", "parking", "property_status", "features_amenities"].map((key, index) => (
                      <tr
                        key={key}
                        className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"}`}
                      >
                        <td className="p-2 font-semibold text-gray-700 dark:text-gray-300 capitalize">
                          {key.replace("_", " ")}
                        </td>
                        {selectedProperties.map((p, i) => (
                          <td
                            key={p.id}
                            className={`p-2 border-l ${i !== 0 ? 'border-gray-300 dark:border-gray-700' : ''}`}
                          >
                            {key === "price"
                              ? `₱${Number(p[key]).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                              : key === "square_meter"
                                ? `${p[key]} sqm.`
                                : key === "floor_number"
                                  ? `${p[key]} floor${p[key] > 1 ? "s" : ""}`

                                  : key === "features_amenities"
                                    ? (() => {
                                      try {
                                        const amenities = typeof p[key] === "string" ? JSON.parse(p[key]) : p[key];
                                        return (
                                          <ul className="list-disc list-inside">
                                            {amenities.map((amenity, i) => (
                                              <li key={i}>{amenity}</li>
                                            ))}
                                          </ul>
                                        );
                                      } catch (error) {
                                        return <span className="text-red-500">Invalid Data</span>;
                                      }
                                    })()
                                    : p[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => exportComparisonToPDF(selectedProperties)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#990e15] text-white rounded-lg text-sm shadow-md hover:bg-red-700"
                >
                  <Download size={18} /> Download PDF
                </button>

              </div>
            </div>
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
}
