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

  const handleChange = (e, formType) => {
    if (formType === "appointment") {
      setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    } else {
      setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = formType === "appointment" ? "/appointments" : "/inquiries";
    const payload = formType === "appointment" ? appointmentData : inquiryData;

    try {
      await callAPI("post", endpoint, payload); // ✅ callAPI used here

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
      {/* ✅ Tabs */}    <SEOComponent />
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
              placeholder={field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          ))}
          <textarea
            name="message"
            value={appointmentData.message}
            onChange={(e) => handleChange(e, "appointment")}
            placeholder="Leave us a message..."
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
              placeholder={field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
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
            placeholder="Leave us a message..."
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
