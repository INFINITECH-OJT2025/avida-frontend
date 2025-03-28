// src\components\admin\job\EditJobForm.js
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Unified API call

const EditJobForm = ({ job, onClose, onJobUpdated }) => {
  const { showToast } = useToast(); 

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    job_type: "Full-time",
    salary_min: "",
    salary_max: "",
    application_deadline: "",
    status: "Unpublished",
    image: null,
    newImage: null,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        description: job.description,
        responsibilities: job.responsibilities,
        qualifications: job.qualifications,
        job_type: job.job_type,
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        application_deadline: job.application_deadline,
        status: job.status,
        image: job.image || null,
        newImage: null,
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, newImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("_method", "PUT");

    for (const key in formData) {
      if (key !== "image" && key !== "newImage" && formData[key] !== null && formData[key] !== "") {
        formDataObj.append(key, formData[key]);
      }
    }

    if (formData.newImage) {
      formDataObj.append("image", formData.newImage);
    }

    try {
      await callAPI("post", `/jobs/${job.id}`, formDataObj, true);
      showToast("Job updated successfully!");
      onJobUpdated();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Unable to update job";
      const details = error?.response?.data?.details;
      if (details) {
        Object.values(details).forEach((err) => showToast(err[0]));
      } else {
        showToast("Error: " + msg);
      }
    }
    
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-7xl relative border">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl">
          &times;
        </button>

        <h2 className="text-lg font-bold text-[#990e15] text-center mb-4">Edit Job</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          {/* Column 1 */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Job Title</label>
            <input type="text" name="title" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.title} onChange={handleChange} />

            <label className="text-sm font-semibold text-gray-700 mt-3">Department</label>
            <input type="text" name="department" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.department} onChange={handleChange} />

            <label className="text-sm font-semibold text-gray-700 mt-3">Job Description</label>
            <textarea name="description" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" rows="3" value={formData.description} onChange={handleChange} />

            <label className="text-sm font-semibold text-gray-700">Responsibilities</label>
            <textarea name="responsibilities" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" rows="3" value={formData.responsibilities} onChange={handleChange} />
          </div>

          {/* Column 2 */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mt-3">Qualifications</label>
            <textarea name="qualifications" required className="border p-6 w-full rounded-lg focus:border-[#990e15]" rows="3" value={formData.qualifications} onChange={handleChange} />

            <label className="text-sm font-semibold text-gray-700 mt-3">Job Type</label>
            <select name="job_type" className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.job_type} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>

            <label className="text-sm font-semibold text-gray-700">Salary Range</label>
            <div className="flex space-x-2">
              <input type="number" name="salary_min" placeholder="Min Salary" className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.salary_min} onChange={handleChange} />
              <input type="number" name="salary_max" placeholder="Max Salary" className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.salary_max} onChange={handleChange} />
            </div>

            <label className="text-sm font-semibold text-gray-700 mt-3">Application Deadline</label>
            <input type="date" name="application_deadline" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.application_deadline} onChange={handleChange} />
          </div>

          {/* Column 3 */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mt-3">Status</label>
            <select name="status" className="border p-2 w-full rounded-lg focus:border-[#990e15]" value={formData.status} onChange={handleChange}>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
            </select>

            <label className="text-sm font-semibold text-gray-700 mt-3">Upload New Image</label>
            <input type="file" name="image" accept="image/*" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleFileChange} />

            {formData.image && !formData.newImage && (
              <>
                <img
                  src={`http://127.0.0.1:8000/storage/${formData.image}`}
                  alt="Job Image"
                  className="mt-2 w-32 h-32 object-cover rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
                <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={[{ src: `http://127.0.0.1:8000/storage/${formData.image}` }]} />
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-3 flex justify-end mt-4">
            <button type="submit" className="bg-[#990e15] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobForm;
