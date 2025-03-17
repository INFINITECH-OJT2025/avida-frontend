import { useState, Fragment } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, X } from "lucide-react";
import ServiceForm from "./ServiceForm"; 

export default function ServiceList({ services, refreshServices }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Service deleted successfully!");
        refreshServices();
      } else {
        alert("Failed to delete service.");
      }
    }
  };

  return (
    <div className="overflow-visible">
      <table className="w-full border bg-white shadow-sm rounded-lg">
        <thead>
          <tr className="bg-[#990e15] text-white text-left">
            <th className="p-3 w-1/6">Image</th>
            <th className="p-3 w-1/6">Title</th>
            <th className="p-3 w-2/6">Description</th>
            <th className="p-3 w-1/6 text-center">Status</th>
            <th className="p-3 w-1/6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {service.image ? (
                    <img
                      src={`/storage/${service.image}`}
                      alt="Service Icon"
                      className="w-10 h-10 rounded-md object-cover cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(`/storage/${service.image}`);
                        setLightboxOpen(true);
                      }}
                    />
                  ) : (
                    <img src="/images/placeholder.png" alt="No Image" className="w-10 h-10 rounded-md" />
                  )}
                </td>
                <td className="p-3">{service.title}</td>
                <td className="p-3 truncate">{service.description.slice(0, 50)}...</td>
                <td className="p-3 text-center">
                  <span className="px-3 py-1 rounded border text-gray-700">
                    {service.status ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ✅ Fix: Dropdown Menu fully visible */}
                <td className="p-3 text-center relative">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="px-3 py-1 border rounded-md bg-white flex items-center space-x-1 hover:bg-gray-100">
                      <span>Actions</span>
                      <ChevronDown size={16} />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        className="absolute right-0 mt-2 min-w-[140px] bg-white border rounded-md shadow-md z-50"
                      >
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setDetailModalOpen(true);
                                  setSelectedService(service);
                                }}
                                className={`block px-4 py-2 w-full text-left text-gray-700 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                View
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setEditingService(service);
                                  setEditModalOpen(true);
                                }}
                                className={`block px-4 py-2 w-full text-left text-gray-700 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <hr className="border-gray-200" />
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(service.id)}
                                className={`block px-4 py-2 w-full text-left text-red-500 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No services available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Lightbox for Viewing Image */}
      {lightboxOpen && selectedImage && (
        <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={[{ src: selectedImage }]} />
      )}

      {/* ✅ View Details Modal (Now properly implemented) */}
      {detailModalOpen && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedService.title}</h2>

            <div className="mb-4">
              <img
                src={selectedService.image ? `/storage/${selectedService.image}` : "/images/placeholder.png"}
                alt="Service"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>

            <p className="text-gray-700 mb-4">{selectedService.description}</p>

            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded border text-gray-700">
                {selectedService.status ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal (Now opens only when clicking "Edit") */}
      <ServiceForm
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        editingService={editingService}
        setEditingService={setEditingService}
        refreshServices={refreshServices}
      />
    </div>
  );
}
