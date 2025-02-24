import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import "lightbox2/dist/css/lightbox.min.css";

export default function NewsForm({ closeModal, selectedNews, fetchNews }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    status: "draft",
    images: [], // ✅ Array to store newly uploaded images
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]); // ✅ Array to display images

  useEffect(() => {
    if (selectedNews) {
      setFormData({
        title: selectedNews?.title || "",
        category: selectedNews?.category || "",
        content: selectedNews?.content || "",
        status: selectedNews?.status || "draft",
        images: [], // ✅ Store new images only
      });

      if (selectedNews.images) {
        try {
          // ✅ Parse JSON images and prepend API storage path
          const existingImages = JSON.parse(selectedNews.images).map((img) => ({
            src: `http://localhost:8000/storage/${img}`,
            title: img,
            isExisting: true, // ✅ Mark existing images
          }));
          setImagePreviews(existingImages);
        } catch (error) {
          console.error("Error parsing images:", error);
        }
      }
    }
  }, [selectedNews]);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: files }));

      // ✅ Generate preview URLs for newly uploaded images
      const newPreviews = files.map((file) => ({
        src: URL.createObjectURL(file),
        title: file.name,
        isExisting: false, // ✅ Mark new uploads
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]); // ✅ Merge with existing images
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please login.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("status", formData.status);

    // ✅ Attach newly uploaded images
    if (formData.images.length > 0) {
      formData.images.forEach((image) => {
        formDataToSend.append("images[]", image);
      });
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (selectedNews) {
        formDataToSend.append("_method", "PUT");
        await axios.post(`http://localhost:8000/api/news/${selectedNews.id}`, formDataToSend, { headers });
      } else {
        await axios.post("http://localhost:8000/api/news", formDataToSend, { headers });
      }

      alert("News saved successfully!");
      closeModal();
      if (typeof fetchNews === "function") {
        fetchNews();
      }
    } catch (error) {
      console.error("Error saving news:", error.response?.data || error.message);
      setError(error.response?.data?.errors || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category" className="border p-2 rounded w-full" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="news">News</option>
          <option value="announcement">Announcement</option>
          <option value="update">Update</option>
        </select>
      </div>

      {/* Content Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Textarea name="content" value={formData?.content || ""} onChange={handleChange} required />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Images</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" multiple />
      </div>

      {/* ✅ Lightbox Preview for Existing and New Images */}
      {imagePreviews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((img, index) => (
              <a key={index} href={img.src} data-lightbox="news-gallery" data-title={img.title}>
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-24 h-24 object-cover rounded border"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")} // ✅ Handle missing images
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Display API Errors */}
      {error && <p className="text-red-500 text-sm">{Object.values(error).join(", ")}</p>}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={closeModal} className="border border-gray-500 text-gray-700 px-4 py-2 rounded" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#990e15] text-white px-6 py-2 rounded" disabled={loading}>
          {loading ? "Saving..." : selectedNews ? "Update" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
