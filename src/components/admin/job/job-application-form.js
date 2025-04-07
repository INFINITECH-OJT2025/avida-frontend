// src\components\admin\job\job-application-form.js
import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Import unified API

const JobApplicationForm = ({ jobId }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    linkedin: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        showToast("Invalid file type. Only PDF, DOC, and DOCX are allowed.", "error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast("Resume file size should not exceed 10MB.", "error");
        return;
      }
      
      // ✅ Remove this line (no more `setErrorMessage`)
      // setErrorMessage(""); ❌
  
      setFormData({ ...formData, resume: file });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.resume) {
      showToast("Please upload your resume.", "error");
      return;
    }
  
    const applicationData = new FormData();
    applicationData.append("full_name", formData.fullName);
    applicationData.append("email", formData.email);
    applicationData.append("phone_number", formData.phone);
    applicationData.append("cover_letter", formData.coverLetter);
    applicationData.append("resume", formData.resume);
    applicationData.append("linkedin_url", formData.linkedin);
    applicationData.append("job_id", jobId);
  
    try {
      await callAPI("post", "/job-applications", applicationData, true);
      showToast("Application Submitted Successfully!", "success");
  
      // Optional: reset form after successful submit
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
        linkedin: "",
      });
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
  
      if (validationErrors) {
        const firstField = Object.keys(validationErrors)[0];
        const firstError = validationErrors[firstField][0];
        showToast(firstError, "error");
      } else {
        const msg =
          error?.response?.data?.message || error.message || "Something went wrong";
        showToast(msg, "error");
      }
    }
  };
  
  return (
    <div className="w-full lg:w-[400px] bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold text-[#990e15] mb-3">Apply for this Job</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
        <input
          type="text"
          name="fullName"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mb-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mb-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
        <input
          type="tel"
          name="phone"
          maxLength={13}
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mb-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Letter (Optional)</label>
        <textarea
          name="coverLetter"
          rows="3"
          value={formData.coverLetter}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mb-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Resume Upload</label>
        <input
          type="file"
          name="resume"
          required
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full border p-2 rounded-lg mb-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">.doc, .docx, PDF only. Max 10MB.</p>

        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn Profile / Portfolio URL (Optional)</label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mb-4 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-[#990e15] text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
