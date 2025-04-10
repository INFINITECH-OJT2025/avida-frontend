// src\components\admin\news\create.js
import { useState, useEffect } from "react";
import { Input } from "../../../../src/components/ui/input";
import Textarea from "../../../../src/components/ui/textarea";
import { Button } from "../../../../src/components/ui/button";
import "lightbox2/dist/css/lightbox.min.css";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api";

export default function NewsForm({ closeModal, selectedNews, fetchNews }) {
  const { toast, showToast } = useToast();

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

      if (selectedNews?.images) {
        let existingImages = [];
        if (typeof selectedNews.images === "string") {
          try {
            existingImages = JSON.parse(selectedNews.images);
          } catch (error) {
            console.error("Error parsing images:", error);
            existingImages = [];
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
    }
  }, [selectedNews]);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
  
      // ✅ Combine new files with previous ones to allow multiple uploads at once
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files], // ✅ merge
      }));
  
      const newPreviews = files.map((file) => ({
        src: URL.createObjectURL(file),
        title: file.name,
        isExisting: false,
      }));
  
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
     
    setError(null);
  
    const token = localStorage.getItem("jwt");
    const formDataToSend = new FormData();
  
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("status", formData.status);
  
    // ✅ Append as "images" (NOT "images[]")
    formData.images.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("images[]", file); // ✅ Correct way to send as an array
      }
    });
    
  
    try {
      const endpoint = selectedNews
        ? `/news/${selectedNews.id}`
        : `/news`;
  
      if (selectedNews) {
        formDataToSend.append("_method", "PUT");
      }
  
      await callAPI("post", endpoint, formDataToSend, true);
      showToast("News saved successfully!", "success");
      closeModal();
      fetchNews?.();
    } catch (error) {
      showToast("Error saving news.", "error");
      console.error("Submission failed:", error.response?.data || error.message);
      setError(error.response?.data?.errors || {});
    } finally {
       
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category" className="border p-2 rounded w-full" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="News">News</option>
          <option value="Announcement">Announcement</option>
          <option value="Update">Update</option>
          <option value="Blog">Blog</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Textarea name="content" value={formData?.content || ""} onChange={handleChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Images</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" multiple />
      </div>

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
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{Object.values(error).join(", ")}</p>}

      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={closeModal} className="border border-gray-500 text-gray-700 px-4 py-2 rounded" >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#990e15] text-white px-6 py-2 rounded" >
          {selectedNews ? "Update" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
