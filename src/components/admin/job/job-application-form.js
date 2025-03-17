import { useState } from "react";

const JobApplicationForm = ({ jobId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    linkedin: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Resume file size should not exceed 10MB.");
        return;
      }
      setErrorMessage("");
      setFormData({ ...formData, resume: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      setErrorMessage("Please upload your resume.");
      return;
    }

    const applicationData = new FormData();
    applicationData.append("full_name", formData.fullName);
    applicationData.append("email", formData.email);
    applicationData.append("phone_number", formData.phone);
    applicationData.append("cover_letter", formData.coverLetter);
    applicationData.append("resume", formData.resume);
    applicationData.append("linkedin_url", formData.linkedin);
    applicationData.append("job_id", jobId); // Ensure job_id is included

    try {
      const response = await fetch("http://127.0.0.1:8000/api/job-applications", {
        method: "POST",
        body: applicationData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          throw new Error(errorMessages);
        } else {
          throw new Error(data.message || "Failed to submit application.");
        }
      }

      alert("Application Submitted Successfully!");
      setErrorMessage(""); // Clear errors after success
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full lg:w-[400px] bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold text-[#990e15] mb-3">Apply for this Job</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">Full Name</label>
        <input
          type="text"
          name="fullName"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-2 text-sm"
          required
          value={formData.fullName}
          onChange={handleChange}
        />

        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">Email Address</label>
        <input
          type="email"
          name="email"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-2 text-sm"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">Phone Number</label>
        <input
          type="tel"
          name="phone"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-2 text-sm"
          required
          value={formData.phone}
          onChange={handleChange}
        />

        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">Cover Letter (Optional)</label>
        <textarea
          name="coverLetter"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-2 text-sm"
          rows="3"
          value={formData.coverLetter}
          onChange={handleChange}
        ></textarea>

        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">Resume Upload</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-1 text-sm"
          onChange={handleFileChange}
        />
        <p className="text-gray-500 dark:text-gray-400 text-xs">.doc, .docx, PDF file only. Max upload size 10MB</p>
        {errorMessage && <p className="text-red-500 dark:text-red-400 text-xs">{errorMessage}</p>}

        <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm">LinkedIn Profile / Portfolio URL (Optional)</label>
        <input
          type="url"
          name="linkedin"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg mb-2 text-sm"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-[#990e15] text-white py-2 rounded-lg hover:bg-red-700 dark:hover:bg-[#b31218] transition text-sm font-semibold"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
