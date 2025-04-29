import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const { showToast } = useToast();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageEdited, setIsImageEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    status: "1",
  });

  useEffect(() => {
    if (isOpen) {
      if (editingService) {
        setFormData({
          title: editingService.title,
          description: editingService.description,
          image: null, // do not set existing image into formData.image
          status: editingService.status ? "1" : "0",
        });

        setSelectedImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${editingService.image}`);
        setIsImageEdited(false);
      } else {
        setFormData({ title: "", description: "", image: null, status: "1" });
        setSelectedImage(null);
        setIsImageEdited(false);
      }
    }
  }, [isOpen, editingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status);

    // Only send image if user changed it
    if (isImageEdited && formData.image) {
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
        showToast(firstMessage, "error");
      } else {
        showToast("Failed to save service.", "error");
      }
    }
  };
const handleDelete = async (key) => {
  toast.info(
    <div>
      <p>Are you sure you want to delete <strong>{formatLabel(key)}</strong> field?</p>
      <div className="flex justify-end gap-3 mt-2">
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => confirmDelete(key)}
        >
          Yes
        </button>
        <button className="bg-gray-400 px-3 py-1 rounded" onClick={toast.dismiss}>
          No
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  );
};

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setIsOpen(false);
      setEditingService(null);
    }}>
      <DialogContent
        className="w-full max-w-[98vw] max-h-[30vh] overflow-hidden px-8 py-6 flex flex-col"
      >

        <DialogHeader>
          <DialogTitle className="text-[#990e15] text-xl font-bold">
            {editingService ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-y-auto pr-2"
          style={{ flex: 1 }}
        >
          {/* Title */}
          <div>
            <label className="block font-medium text-sm text-gray-700">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Service Title"
              required={!editingService}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-sm text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block font-medium text-sm text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                const textarea = e.target;
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;

                setFormData({ ...formData, description: textarea.value });
              }}

              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 resize-none overflow-auto whitespace-pre-wrap break-words"
              style={{
                maxHeight: "300px", // 🧱 adjust as needed (200px, 400px, etc.)
                transition: "height 0.2s ease-in-out",
              }}
              required={!editingService}
            />

          </div>


          {/* Upload Image */}
          <div className="md:col-span-2">
            <label className="block font-medium text-sm text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData({ ...formData, image: file });
                  setSelectedImage(URL.createObjectURL(file));
                  setIsImageEdited(true);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Image Preview */}

          {selectedImage && (
            <div className="md:col-span-2">  <label className="block font-medium text-sm text-gray-700">Preview Image</label>
              <img
                src={selectedImage}
                alt="Selected Preview"
                className=" max-h-[200vh] object-cover rounded-md cursor-pointer"
                style={{
                  maxHeight: "80px",
                  maxWidth: "80px" // 🧱 adjust as needed (200px, 400px, etc.)
                }}
                onClick={() => setLightboxOpen(true)}
              />
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{ src: selectedImage }]}
              />
            </div>
          )}
        </form>

        <div className="flex justify-end gap-4  pt-4 mt-4 sticky bottom-0 right-0 bg-white z-10">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              setIsOpen(false);
              setEditingService(null);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="your-form-id" // optional if not wrapping around the form
            className="w-32 bg-[#990e15] text-white hover:bg-[#7e0c12]"
          >
            {editingService ? "Update" : "Add"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
