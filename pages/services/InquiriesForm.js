import { useState } from "react";
import { useToast } from "../../src/context/ToastContext";
import { callAPI } from "../../src/utils/api";
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

  // ✅ Email Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Phone Validation (numeric, starts with 09, 11 digits)
  const validatePhone = (phone) => /^09\d{9}$/.test(phone);

  // ✅ Handle value change
  const handleChange = (e, formType) => {
    const { name, value } = e.target;
  
    let cleanValue = value;
  
    if (name.includes("phone")) {
      // ✅ Remove non-digits
      cleanValue = value.replace(/\D/g, "");
  
      // ✅ Limit to 11 digits max
      if (cleanValue.length > 11) {
        cleanValue = cleanValue.slice(0, 11);
      }
    }
  
    if (formType === "appointment") {
      setAppointmentData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setInquiryData((prev) => ({ ...prev, [name]: cleanValue }));
    }
  };
  

  // ✅ On Blur Validation
  const handleBlur = (e, formType) => {
    const { name, value } = e.target;

    if (name.includes("email") && !validateEmail(value)) {
      showToast("Please enter a valid email address.", "error");
    }

    if (name.includes("phone")) {
      if (!validatePhone(value)) {
        showToast("Phone number must start with 09 and be 11 digits long.", "error");
      }
    }
  };

  // ✅ Submit Handler
  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setLoading(true);

    const payload = formType === "appointment" ? appointmentData : inquiryData;
    const endpoint = formType === "appointment" ? "/appointments" : "/inquiries";

    // Final validation check
    const emailValid = validateEmail(payload.email);
    const phoneValid = validatePhone(payload.phone_number || payload.phone);

    if (!emailValid) {
      showToast("Invalid email format.", "error");
      setLoading(false);
      return;
    }

    if (!phoneValid) {
      showToast("Invalid phone number. It must start with 09 and be 11 digits.", "error");
      setLoading(false);
      return;
    }

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
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
      <SEOComponent />

      {/* Tabs */}
      <div className="flex justify-between border-b pb-2 mb-4 dark:border-gray-600">
        {["appointment", "inquiry"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-1/2 text-center py-2 ${
              activeTab === tab
                ? "text-[#990e15] font-bold border-b-2 border-[#990e15]"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {tab === "appointment" ? "Appointment" : "Inquiry"}
          </button>
        ))}
      </div>

      {/* Appointment Form */}
      {activeTab === "appointment" && (
        <form onSubmit={(e) => handleSubmit(e, "appointment")} className="grid gap-3">
          {["first_name", "last_name", "email", "phone_number", "appointment_date", "appointment_time"].map((field) => (
            <input
              key={field}
              type={
                field.includes("date")
                  ? "date"
                  : field.includes("time")
                  ? "time"
                  : field.includes("email")
                  ? "email"
                  : "text"
              }
              maxLength={field.includes("phone") ? 11 : undefined}
              name={field}
              value={appointmentData[field]}
              onChange={(e) => handleChange(e, "appointment")}
              onBlur={(e) => handleBlur(e, "appointment")}
              placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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

      {/* Inquiry Form */}
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
              placeholder={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
