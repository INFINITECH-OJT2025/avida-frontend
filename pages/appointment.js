import { useState } from "react";
import { useToast } from "../src/context/ToastContext";
import useConfirmDialog from "../src/hooks/useConfirmDialog";
import { callAPI } from "../src/utils/api";
import SEOComponent from "../src/hooks/useSEO";

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState("appointment");
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

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

  const handleChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = (name === "phone" || name === "phone_number") ? value.replace(/\D/g, "") : value;
    const updatedValue = type === "checkbox" ? checked : sanitizedValue;

    if (formType === "appointment") {
      setAppointmentData({ ...appointmentData, [name]: updatedValue });
    } else {
      setInquiryData({ ...inquiryData, [name]: updatedValue });
    }
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    const agreed = formType === "appointment" ? appointmentData.accepted_terms : inquiryData.accepted_terms;

    if (!agreed) {
      return showToast("Please agree to the Terms and Privacy Notice before submitting.", "error");
    }

    showConfirm(`Are you sure you want to submit this ${formType}?`, () => confirmSubmit(formType));
  };

  const confirmSubmit = async (formType) => {
    const endpoint = formType === "appointment" ? "/appointments" : "/inquiries";
    const payload = formType === "appointment" ? appointmentData : {
      ...inquiryData,
      phone_number: inquiryData.phone,
    };

    try {
      await callAPI("post", endpoint, payload);
      showToast(`${formType === "appointment" ? "Appointment" : "Inquiry"} submitted successfully!`, "success");

      // Reset
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
    } catch (error) {
      const firstError = error.response?.data?.errors ? Object.values(error.response.data.errors)[0][0] : "Something went wrong.";
      showToast(firstError, "error");
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const isValidPhoneNumber = (phone) => /^09\d{9}$/.test(phone);

  const handleBlur = (e, formType) => {
    const { name, value } = e.target;
    if (name === "email" && !isValidEmail(value.trim())) {
      showToast("Invalid email format.", "error");
    }
    if ((name === "phone" || name === "phone_number") && !isValidPhoneNumber(value)) {
      showToast("Phone must start with '09' and be 11 digits.", "error");
      formType === "appointment"
        ? setAppointmentData((prev) => ({ ...prev, phone_number: "" }))
        : setInquiryData((prev) => ({ ...prev, phone: "" }));
    }
  };

  const TermsCheckbox = ({ checked, onChange }) => (
    <div className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        name="accepted_terms"
        checked={checked}
        onChange={onChange}
        required
        className="mt-1"
      />
      <p className="leading-tight">
        I agree to the{" "}
        <a href="/terms" target="_blank" className="underline text-blue-600">Terms</a>{" "}
        and{" "}
        <a href="/privacy" target="_blank" className="underline text-blue-600">Privacy Notice</a>.
      </p>
    </div>
  );
  

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 dark:text-white p-6 shadow-lg rounded-lg">
      <SEOComponent />
      <div className="flex justify-between border-b pb-2 mb-4 dark:border-gray-600">
        <button className={`w-1/2 text-center py-2 ${activeTab === "appointment" ? "text-[#990e15] font-bold border-b-2 border-[#990e15]" : "text-gray-600"}`} onClick={() => setActiveTab("appointment")}>
          Appointment
        </button>
        <button className={`w-1/2 text-center py-2 ${activeTab === "inquiry" ? "text-[#990e15] font-bold border-b-2 border-[#990e15]" : "text-gray-600"}`} onClick={() => setActiveTab("inquiry")}>
          Inquiry
        </button>
      </div>

      {activeTab === "appointment" && (
        <form onSubmit={(e) => handleSubmit(e, "appointment")} className="grid gap-3">
          <input type="text" name="first_name" value={appointmentData.first_name} onChange={(e) => handleChange(e, "appointment")} placeholder="First Name" className="input-field" required />
          <input type="text" name="last_name" value={appointmentData.last_name} onChange={(e) => handleChange(e, "appointment")} placeholder="Last Name" className="input-field" required />
          <input type="email" name="email" value={appointmentData.email} onChange={(e) => handleChange(e, "appointment")} onBlur={(e) => handleBlur(e, "appointment")} placeholder="Email" className="input-field" required />
          <input type="text" name="phone_number" value={appointmentData.phone_number} onChange={(e) => handleChange(e, "appointment")} onBlur={(e) => handleBlur(e, "appointment")} maxLength="11" placeholder="Phone Number" className="input-field" required />
          <input type="date" name="appointment_date" value={appointmentData.appointment_date} onChange={(e) => handleChange(e, "appointment")} className="input-field" required />
          <input type="time" name="appointment_time" value={appointmentData.appointment_time} onChange={(e) => handleChange(e, "appointment")} className="input-field" required />
          <textarea name="message" value={appointmentData.message} onChange={(e) => handleChange(e, "appointment")} placeholder="Message" className="input-field" rows="3" />
          <TermsCheckbox checked={appointmentData.accepted_terms} onChange={(e) => handleChange(e, "appointment")} />
          <button type="submit" className="submit-btn">Submit Appointment</button>
        </form>
      )}

      {activeTab === "inquiry" && (
        <form onSubmit={(e) => handleSubmit(e, "inquiry")} className="grid gap-3">
          <input type="text" name="first_name" value={inquiryData.first_name} onChange={(e) => handleChange(e, "inquiry")} placeholder="First Name" className="input-field" required />
          <input type="text" name="last_name" value={inquiryData.last_name} onChange={(e) => handleChange(e, "inquiry")} placeholder="Last Name" className="input-field" required />
          <input type="email" name="email" value={inquiryData.email} onChange={(e) => handleChange(e, "inquiry")} onBlur={(e) => handleBlur(e, "inquiry")} placeholder="Email" className="input-field" required />
          <input type="text" name="phone" value={inquiryData.phone} onChange={(e) => handleChange(e, "inquiry")} onBlur={(e) => handleBlur(e, "inquiry")} maxLength="11" placeholder="Phone Number" className="input-field" required />
          <select name="inquiry_type" value={inquiryData.inquiry_type} onChange={(e) => handleChange(e, "inquiry")} className="input-field">
            <option value="">Select Inquiry Type</option>
            <option value="Sales">Sales</option>
            <option value="Leasing">Leasing</option>
          </select>
          <textarea name="message" value={inquiryData.message} onChange={(e) => handleChange(e, "inquiry")} placeholder="Message" className="input-field" rows="3" />
          <TermsCheckbox checked={inquiryData.accepted_terms} onChange={(e) => handleChange(e, "inquiry")} />
          <button type="submit" className="submit-btn">Submit Inquiry</button>
        </form>
      )}

      <ConfirmDialog />
    </div>
  );
}
