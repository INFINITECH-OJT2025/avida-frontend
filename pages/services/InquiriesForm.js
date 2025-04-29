import { useState } from "react";
import { useToast } from "../../src/context/ToastContext";
import { callAPI } from "../../src/utils/api";
import SEOComponent from "../../src/hooks/useSEO";

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState("appointment");
  const { showToast } = useToast();

  const [appointmentData, setAppointmentData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    appointment_date: "",
    appointment_time: "",
    message: "",
    accepted_terms: false,
  });

  const [inquiryData, setInquiryData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    inquiry_type: "",
    message: "",
    accepted_terms: false,
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^09\d{9}$/.test(phone);

  const handleChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name.includes("phone")) {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 11) newValue = newValue.slice(0, 11);
    }

    if (formType === "appointment") {
      setAppointmentData((prev) => ({ ...prev, [name]: newValue }));
    } else {
      setInquiryData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleBlur = (e, formType) => {
    const { name, value } = e.target;
    if (name.includes("email") && !validateEmail(value)) {
      showToast("Please enter a valid email address.", "error");
    }
    if (name.includes("phone") && !validatePhone(value)) {
      showToast("Phone number must start with 09 and be 11 digits long.", "error");
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();

    const payload = formType === "appointment" ? appointmentData : inquiryData;
    const endpoint = formType === "appointment" ? "/appointments" : "/inquiries";
    const emailValid = validateEmail(payload.email);
    const phoneValid = validatePhone(payload.phone_number || payload.phone);

    if (!emailValid) {
      showToast("Invalid email format.", "error");
      return;
    }
    if (!phoneValid) {
      showToast("Invalid phone number. It must start with 09 and be 11 digits.", "error");
      return;
    }
    if (!payload.accepted_terms) {
      showToast("You must accept the Terms and Privacy Notice to continue.", "error");
      return;
    }

    const finalPayload = {
      ...payload,
      accepted_terms: payload.accepted_terms ? "1" : "0",
    };

    try {
      await callAPI("post", endpoint, finalPayload);
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
            accepted_terms: false,
          })
        : setInquiryData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            inquiry_type: "",
            message: "",
            accepted_terms: false,
          });
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
      <SEOComponent />

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
          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="accepted_terms"
              checked={appointmentData.accepted_terms}
              onChange={(e) => handleChange(e, "appointment")}
              className="mt-1"
            />
            <p className="leading-tight">
              I agree to the {" "}
              <a href="/terms" target="_blank" className="underline text-blue-600">Terms</a>{" "}
              and {" "}
              <a href="/privacy" target="_blank" className="underline text-blue-600">Privacy Notice</a>.
            </p>
          </div>
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            Submit Appointment
          </button>
        </form>
      )}

      {activeTab === "inquiry" && (
        <form onSubmit={(e) => handleSubmit(e, "inquiry") } className="grid gap-3">
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
          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="accepted_terms"
              checked={inquiryData.accepted_terms}
              onChange={(e) => handleChange(e, "inquiry")}
              className="mt-1"
            />
            <p className="leading-tight">
              I agree to the {" "}
              <a href="/terms" target="_blank" className="underline text-blue-600">Terms</a>{" "}
              and {" "}
              <a href="/privacy" target="_blank" className="underline text-blue-600">Privacy Notice</a>.
            </p>
          </div>
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            Submit Inquiry
          </button>
        </form>
      )}
    </div>
  );
}
