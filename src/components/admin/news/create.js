import { useState, useEffect } from "react";
import { Input } from "../../../../src/components/ui/input";
import Textarea from "../../../../src/components/ui/textarea";
import { Button } from "../../../../src/components/ui/button";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api";

export default function NewsForm({ closeModal, selectedNews, fetchNews }) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    status: "draft",
    images: [],
  });

  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (selectedNews) {
      setFormData({
        title: selectedNews?.title || "",
        category: selectedNews?.category || "",
        content: selectedNews?.content || "",
        status: selectedNews?.status || "draft",
        images: [],
      });

      let existingImages = [];
      if (typeof selectedNews.images === "string") {
        try {
          existingImages = JSON.parse(selectedNews.images);
        } catch (err) {
          console.error("Error parsing images:", err);
        }
      } else if (Array.isArray(selectedNews.images)) {
        existingImages = selectedNews.images;
      }

      setImagePreviews(
        existingImages.map((img) => ({
          src: img.startsWith("http") ? img : `https://infinitech-api3.site/storage/${img}`,
          title: img,
          isExisting: true,
        }))
      );
    }
  }, [selectedNews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const previews = files.map((file) => ({
      src: URL.createObjectURL(file),
      title: file.name,
      isExisting: false,
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("status", formData.status);

    formData.images.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("images[]", file);
      }
    });

    try {
      const endpoint = selectedNews ? `/news/${selectedNews.id}` : `/news`;
      if (selectedNews) formDataToSend.append("_method", "PUT");

      await callAPI("post", endpoint, formDataToSend, true);
      showToast("News saved successfully!", "success");
      closeModal();
      fetchNews?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Error saving news.", "error");
      setError(error.response?.data?.errors || {});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-xl space-y-6 relative z-[100]"
    >
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">{selectedNews ? "Edit News" : "Create News"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#990e15]"
          >
            <option value="">Select Category</option>
            <option value="News">News</option>
            <option value="Announcement">Announcement</option>
            <option value="Update">Update</option>
            <option value="Blog">Blog</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm text-gray-700">Content</label>
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          required
          className="resize-none border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-sm text-gray-700">Upload Images</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} multiple />
        {imagePreviews.length > 0 && (
          <div className="mt-3 p-2 border rounded bg-gray-50 max-h-32 overflow-y-auto">
            <PhotoProvider>
              <div className="flex gap-3 flex-wrap">
                {imagePreviews.map((img, index) => (
                  <PhotoView key={index} src={img.src}>
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-10 h-10 object-cover border border-gray-300 rounded shadow cursor-pointer"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 mt-1">
          {Object.values(error).join(", ")}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-6 border-t mt-6">
        <Button
          type="button"
          onClick={closeModal}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#990e15] text-white hover:bg-[#7f0b12]">
          {selectedNews ? "Update" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
