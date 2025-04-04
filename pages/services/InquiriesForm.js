import { useState } from "react";
import { useToast } from "../../src/context/ToastContext";
import { callAPI } from "../../src/utils/api"; // ✅ centralized API call
import SEOComponent from "../../src/hooks/useSEO";

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState("appointment");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [appointmentData, setAppointmentData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    appointment_date: "",
    appointment_time: "",
    message: "",
  });

  const [inquiryData, setInquiryData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    inquiry_type: "",
    message: "",
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => /^09\d{9}$/.test(phone);

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    const isPhoneField = name === "phone" || name === "phone_number";
    const sanitizedValue = isPhoneField ? value.replace(/\D/g, "") : value;

    if (formType === "appointment") {
      setAppointmentData({ ...appointmentData, [name]: sanitizedValue });
    } else {
      setInquiryData({ ...inquiryData, [name]: sanitizedValue });
    }
  };

  const handleBlur = (e, formType) => {
    const { name, value } = e.target;
    const phone = formType === "appointment" ? appointmentData.phone_number : inquiryData.phone;

    if (name === "email" && !isValidEmail(value)) {
      showToast("Email must include '@' and a valid domain.", "error");
    }

    if ((name === "phone" || name === "phone_number") && !isValidPhone(value)) {
      showToast("Phone number must start with '09' and contain exactly 11 digits.", "error");
    }
  };

  const validateFields = (formType) => {
    const data = formType === "appointment" ? appointmentData : inquiryData;
    const phone = formType === "appointment" ? data.phone_number : data.phone;
    if (!isValidEmail(data.email)) {
      showToast("Email must include '@' and a valid domain.", "error");
      return false;
    }
    if (!isValidPhone(phone)) {
      showToast("Phone number must start with '09' and contain exactly 11 digits.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields(formType)) {
      setLoading(false);
      return;
    }

    const endpoint = formType === "appointment" ? "/appointments" : "/inquiries";
    const payload = formType === "appointment"
      ? appointmentData
      : {
          ...inquiryData,
          phone_number: inquiryData.phone,
        };

    try {
      await callAPI("post", endpoint, payload);

      showToast(
        formType === "appointment"
          ? "Appointment booked successfully!"
          : "Inquiry submitted successfully!",
        "success"
      );

      formType === "appointment"
        ? setAppointmentData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            appointment_date: "",
            appointment_time: "",
            message: "",
          })
        : setInquiryData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            inquiry_type: "",
            message: "",
          });
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Something went wrong. Please try again.", "error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
      <SEOComponent />

      {/* ✅ Tabs */}
      <div className="flex justify-between border-b pb-2 mb-4 dark:border-gray-600">
        <button
          className={`w-1/2 text-center py-2 ${
            activeTab === "appointment"
              ? "text-[#990e15] font-bold border-b-2 border-[#990e15] dark:border-[#ff6666]"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => setActiveTab("appointment")}
        >
          Appointment
        </button>
        <button
          className={`w-1/2 text-center py-2 ${
            activeTab === "inquiry"
              ? "text-[#990e15] font-bold border-b-2 border-[#990e15] dark:border-[#ff6666]"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => setActiveTab("inquiry")}
        >
          Inquiry
        </button>
      </div>

      {/* ✅ Appointment Form */}
      {activeTab === "appointment" && (
        <form onSubmit={(e) => handleSubmit(e, "appointment")} className="grid gap-3">
          {["first_name", "last_name", "email", "phone_number", "appointment_date", "appointment_time"].map((field) => (
            <input
              key={field}
              type={field.includes("date") ? "date" : field.includes("time") ? "time" : field.includes("email") ? "email" : "text"}
              name={field}
              value={appointmentData[field]}
              onChange={(e) => handleChange(e, "appointment")}
              onBlur={(e) => handleBlur(e, "appointment")}
              placeholder={
                field === "phone_number"
                  ? "Phone Number (e.g. 09123456789)"
                  : field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
              }
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              maxLength={field === "phone_number" ? 11 : undefined}
            />
          ))}
          <textarea
            name="message"
            value={appointmentData.message}
            onChange={(e) => handleChange(e, "appointment")}
            placeholder="Briefly describe your concern or request (e.g. schedule, details, etc.)"
            rows="3"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            {loading ? "Booking..." : "Submit Appointment"}
          </button>
        </form>
      )}

      {/* ✅ Inquiry Form */}
      {activeTab === "inquiry" && (
        <form onSubmit={(e) => handleSubmit(e, "inquiry")} className="grid gap-3">
          {["first_name", "last_name", "email", "phone"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              value={inquiryData[field]}
              onChange={(e) => handleChange(e, "inquiry")}
              onBlur={(e) => handleBlur(e, "inquiry")}
              placeholder={
                field === "phone"
                  ? "Phone Number (e.g. 09123456789)"
                  : field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
              }
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              maxLength={field === "phone" ? 11 : undefined}
            />
          ))}
          <select
            name="inquiry_type"
            value={inquiryData.inquiry_type}
            onChange={(e) => handleChange(e, "inquiry")}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Select Inquiry Type</option>
            <option value="Sales">Sales Inquiry</option>
            <option value="Leasing">Leasing Inquiry</option>
          </select>
          <textarea
            name="message"
            value={inquiryData.message}
            onChange={(e) => handleChange(e, "inquiry")}
            placeholder="Briefly describe your concern or request (e.g. unit details, job application, etc.)"
            rows="3"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}