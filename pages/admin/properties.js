// pages/admin/properties.js
import { useState, useEffect } from "react";
import "lightbox2/dist/css/lightbox.min.css";
import AdminLayout from "../../src/components/layout/AdminLayout";
import Image from "next/image";
import { useToast } from "../../src/context/ToastContext";
import useConfirmDialog from "../../src/hooks/useConfirmDialog";
import { getProperties, updatePropertyStatus, deletePropertyById } from "../../src/utils/api";
import SEOComponent from "../../src/hooks/useSEO";
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(price);
};

export function MediaDisplay({ viewProperty }) {
  useEffect(() => {
    import("lightbox2")
      .then((lb) => {
        lb.default.option({
          resizeDuration: 200,
          wrapAround: true,
          alwaysShowNavOnTouchDevices: true,
        });
      })
      .catch((err) => console.error("Failed to load lightbox2:", err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {viewProperty.media && viewProperty.media.length > 0 ? (
        viewProperty.media.map((mediaItem, index) => (
          mediaItem.type === "video" ? (
            <video key={index} src={mediaItem.url} className="w-full h-56 object-cover rounded-lg" controls />
          ) : mediaItem.type === "image" ? (
            <a
              key={index}
              href={mediaItem.url}
              data-lightbox="property-gallery"
              data-title={`Property Image ${index}`}
            >
              <Image
                src={mediaItem.url}
                alt={`Property Image ${index}`}
                width={600}
                height={400}
                className="rounded-lg cursor-pointer object-cover"
                unoptimized
              />
            </a>
          ) : null
        ))
      ) : (
        <Image
          src="/default-property.jpg"
          alt="No media available"
          width={600}
          height={400}
          className="rounded-lg object-cover"
        />
      )}
    </div>
  );
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProperty, setViewProperty] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showToast } = useToast(); // ✅ Only showToast, not toast
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
      showToast("Properties loaded successfully!", "success");
    } catch (error) {
      console.error("Error fetching properties:", error);
      showToast("Failed to load properties.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setDropdownOpen(null);
    try {
      await updatePropertyStatus(id, newStatus);
      showToast("Property status updated!", "success");
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error);
      showToast("Failed to update property.", "error");
    }
  };

  const deleteProperty = (id) => {
    showConfirm("Are you sure you want to delete this property?", async () => {
      try {
        await deletePropertyById(id);
        showToast("Property deleted!", "success");
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        showToast("Failed to delete property.", "error");
      }
    });
  };
  

  const paginatedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(properties.length / itemsPerPage));

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="p-8 max-w-7xl ml-auto mr-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-5xl font-bold text-[#990e15] mb-6">Property Management</h2>

        {loading ? (
          <p className="text-gray-600">Loading properties...</p>
        ) : (
          <>
            <table className="w-full border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#990e15] text-white">
                  <th className="p-4 text-left">Property Name</th>
                  <th className="p-4 text-left">Contact Person</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-gray-100">
                    <td className="p-4">{property.property_name}</td>
                    <td className="p-4">{property.first_name} {property.last_name}</td>
                    <td className="p-4">{formatPrice(property.price)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded text-white ${property.status === "approved"
                          ? "bg-green-500"
                          : property.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"}`}
                      >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-2 relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === property.id ? null : property.id)}
                        className="border border-gray-300 px-3 py-1 rounded-md text-left flex items-center justify-between"
                      >
                        Actions ▼
                      </button>

                      {dropdownOpen === property.id && (
                        <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-50">
                          <button onClick={() => setViewProperty(property)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            View
                          </button>
                          <button onClick={() => updateStatus(property.id, "approved")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            Approve
                          </button>
                          <button onClick={() => updateStatus(property.id, "rejected")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                            Reject
                          </button>
                          <button onClick={() => deleteProperty(property.id)} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {viewProperty && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg w-3/4 shadow-lg max-h-[80vh] overflow-y-auto">
                  <button onClick={() => setViewProperty(null)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
                    Close
                  </button>
                  <h3 className="text-2xl font-bold text-[#990e15]">{viewProperty.property_name}</h3>
                  <p className="text-gray-600">{viewProperty.location}</p>
                  <p><strong>Price:</strong> {formatPrice(viewProperty.price)}</p>
                  <p><strong>Unit Type:</strong> {viewProperty.unit_type || "N/A"}</p>
                  <p><strong>Unit Status:</strong> {viewProperty.unit_status || "N/A"}</p>
                  <p><strong>Parking:</strong> {viewProperty.parking || "N/A"}</p>
                  <p><strong>Square Meter:</strong> {viewProperty.square_meter || "N/A"}</p>
                  <p><strong>Floor Number:</strong> {viewProperty.floor_number || "N/A"}</p>
                  <p><strong>Property Status:</strong> {viewProperty.property_status || "N/A"}</p>
                  <p><strong>Features and Amenities:</strong> {viewProperty.feature_amenities || "N/A"}</p>

                  <MediaDisplay viewProperty={viewProperty} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmDialog />

    </AdminLayout>
  );
}
