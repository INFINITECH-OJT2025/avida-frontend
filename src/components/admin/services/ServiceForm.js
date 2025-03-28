import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { callAPI } from "../../../utils/api";

export default function ServiceForm({
  isOpen,
  setIsOpen,
  editingService,
  setEditingService,
  refreshServices,
}) {
  const { showToast } = useToast(); // ✅ updated for correct naming
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    status: "1",
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title,
        description: editingService.description,
        image: null,
        status: editingService.status ? "1" : "0",
      });
      if (editingService.image) {
        setSelectedImage(`/storage/${editingService.image}`);
      }
    } else {
      setFormData({ title: "", description: "", image: null, status: "1" });
      setSelectedImage(null); // ✅ Reset preview when modal is reused
    }
  }, [editingService, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editingService) {
        await callAPI("put", `/admin/services/${editingService.id}`, formDataToSend, true);
        showToast("Service updated successfully", "success");
      } else {
        await callAPI("post", "/admin/services", formDataToSend, true);
        showToast("Service created successfully", "success");
      }

      setEditingService(null);
      setIsOpen(false);
      refreshServices();
    } catch (error) {
      console.error("Error submitting service:", error);
    
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstKey = Object.keys(validationErrors)[0];
        const firstMessage = validationErrors[firstKey][0];
        showToast(firstMessage, "error"); // 💬 Show Laravel's actual error
      } else {
        showToast("Failed to save service.", "error");
      }
    }
    
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
          <button
            onClick={() => {
              setIsOpen(false);
              setEditingService(null);
            }}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingService ? "Edit Service" : "Add New Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Service Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600"
                required={!editingService}

              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Service Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600"
                required={!editingService}

              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, image: file });
                  if (file) setSelectedImage(URL.createObjectURL(file));
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {selectedImage && (
              <div className="mt-3">
                <img
                  src={selectedImage}
                  alt="Selected Preview"
                  className="w-full h-40 object-cover rounded-md cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
                <Lightbox
                  open={lightboxOpen}
                  close={() => setLightboxOpen(false)}
                  slides={[{ src: selectedImage }]}
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setEditingService(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#990e15] text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                {editingService ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
