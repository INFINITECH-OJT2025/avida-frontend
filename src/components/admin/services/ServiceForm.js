import { useState, useEffect } from "react";
import { X } from "lucide-react"; // Importing close icon

export default function ServiceForm({ isOpen, setIsOpen, editingService, setEditingService, refreshServices }) {
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
        status: editingService.status ? "1" : "0",
      });
    } else {
      setFormData({ title: "", description: "", image: null, status: "1" });
    }
  }, [editingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status === "1" ? "1" : "0");

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/services${editingService ? `/${editingService.id}?_method=PUT` : ""}`,
        {
          method: "POST",
          body: formDataToSend,
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed: ${JSON.stringify(errorData.errors)}`);
        return;
      }

      alert(editingService ? "Updated successfully" : "Service created!");
      setEditingService(null);
      setIsOpen(false); // Close modal after submission
      refreshServices();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save service.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
          {/* Close Button at the Top Right */}
          <button 
            onClick={() => setIsOpen(false)} 
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
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Service Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

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
                onClick={() => setIsOpen(false)} 
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button type="submit" className="bg-[#990e15] text-white px-4 py-2 rounded-md hover:bg-red-700">
                {editingService ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
