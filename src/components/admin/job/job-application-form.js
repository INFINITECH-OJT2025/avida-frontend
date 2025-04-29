import { useState, useEffect } from "react";

import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Import unified API

const JobApplicationForm = ({ jobId, isOpen, onClose }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    linkedin: "",
    accepted_terms: false,
  });

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validateEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^09\d{9}$/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleEmailBlur = () => {
    const valid = validateEmail(formData.email);
    setEmailValid(valid);
    if (!valid) {
      showToast("Please enter a valid email address.", "error");
    }
  };

  const handlePhoneBlur = () => {
    const valid = validatePhone(formData.phone);
    setPhoneValid(valid);
    if (!valid) {
      showToast("Phone number must be numeric, 11 digits, and start with '09'.", "error");
    }
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
      setFormData({ ...formData, resume: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      showToast("Please upload your resume.", "error");
      return;
    }

    if (!emailValid) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (!phoneValid) {
      showToast("Phone number must be numeric, 11 digits, and start with '09'.", "error");
      return;
    }
    if (!formData.accepted_terms) {
      showToast("You must accept the Terms and Privacy Notice to continue.", "error");
      return;
    }
    const applicationData = new FormData();
    applicationData.append("full_name", formData.fullName);
    applicationData.append("email", formData.email);
    applicationData.append("phone_number", formData.phone);
    applicationData.append("cover_letter", formData.coverLetter);
    applicationData.append("resume", formData.resume);
    applicationData.append("linkedin_url", formData.linkedin);
    applicationData.append("accepted_terms", formData.accepted_terms ? "1" : "0");

    applicationData.append("job_id", jobId);

    try {
      await callAPI("post", "/job-applications", applicationData, true);
      showToast("Application Submitted Successfully!", "success");


      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
        linkedin: "",
        accepted_terms: false,
      });
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed mt-28 inset-0 z-[60] flex justify-end items-start">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar Form */}
      <div
        className="relative z-50 h-full w-[360px] bg-white dark:bg-gray-800 dark:text-white shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-500 ease-in-out transform translate-x-0 rounded-l-xl"
      >
        <div className="relative mt-20 w-full h-full p-6 pt-14">
          <button
            onClick={onClose}
            className="absolute top-0 left-4 text-gray-500 hover:text-black dark:hover:text-white text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-xl font-bold text-[#990e15] mt-4 mb-4">Apply for this Job</h2>
          <form onSubmit={handleSubmit} className="text-sm space-y-3">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className={`w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${!emailValid ? "border-red-500" : ""
                  }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                maxLength={11}
                required
                value={formData.phone}
                onChange={(e) => {
                  // Allow only numbers
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, phone: value });
                }}
                onBlur={() => {
                  const isValid = /^09\d{9}$/.test(formData.phone);
                  if (!isValid) {
                    showToast("Phone number must start with '09' and be exactly 11 digits.", "error");
                  }
                }}
                className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>


            <div>
              <label className="block font-semibold mb-1">Cover Letter (Optional)</label>
              <textarea
                name="coverLetter"
                rows="3"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Resume Upload</label>
              <input
                type="file"
                name="resume"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full border p-2 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                .doc, .docx, PDF only. Max 10MB.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">LinkedIn / Portfolio URL (Optional)</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="accepted_terms"
                checked={formData.accepted_terms}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="leading-tight">
                I agree to the {" "}
                <a href="/terms" target="_blank" className="underline text-blue-600">Terms</a>{" "}
                and {" "}
                <a href="/privacy" target="_blank" className="underline text-blue-600">Privacy Notice</a>.
              </p>
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-[#990e15] text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;