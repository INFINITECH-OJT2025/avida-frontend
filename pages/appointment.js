import { useState } from "react";
import axios from "axios";
import { useToast } from "../src/context/ToastContext"; // ✅ Import Global Toast
import useConfirmDialog from "../src/hooks/useConfirmDialog";
import { callAPI } from "../src/utils/api"; // adjust the path as needed
import SEOComponent from "../src/hooks/useSEO";

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState("appointment"); // Default to Appointment tab
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();


  // ✅ Appointment Form State
  const [appointmentData, setAppointmentData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    appointment_date: "",
    appointment_time: "",
    message: "",
  });

  // ✅ Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    inquiry_type: "",
    message: "",
  });

  // ✅ Handle Input Changes
  const handleChange = (e, formType) => {
    const { name, value } = e.target;
  
    // For numeric phone fields
    const isPhoneField = name === "phone" || name === "phone_number";
    const sanitizedValue = isPhoneField ? value.replace(/\D/g, "") : value;
  
    if (formType === "appointment") {
      setAppointmentData({ ...appointmentData, [name]: sanitizedValue });
    } else {
      setInquiryData({ ...inquiryData, [name]: sanitizedValue });
    }
  };
  

  // ✅ Handle Form Submission with Toast Confirmation
  const handleSubmit = (e, formType) => {
    e.preventDefault();
    setLoading(true);

    showConfirm(
      `Are you sure you want to submit this ${formType}?`,
      () => confirmSubmit(formType)
    
    
    );
  };

  // ✅ Function to Send Data to Backend After Confirmation
  const confirmSubmit = async (formType) => {
    setLoading(true);
  
    const endpoint =
      formType === "appointment"
        ? "/appointments"
        : "/inquiries";
  
        const payload = formType === "appointment"
        ? appointmentData
        : {
            ...inquiryData,
            phone_number: inquiryData.phone, // ✅ Map 'phone' to 'phone_number'
          };
      
  
    try {
      await callAPI("post", endpoint, payload);
      showToast(`${formType === "appointment" ? "Appointment" : "Inquiry"} submitted successfully!`, "success");
  
      // Reset form after submission
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
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        showToast(firstError, "error");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    }
  
    setLoading(false);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };
  
  const isValidPhoneNumber = (phone) => /^09\d{9}$/.test(phone);
  
  const handleBlur = (e, formType) => {
    const { name, value } = e.target;
  
    if (name === "email" && !isValidEmail(value.trim())) {
      showToast("Invalid email format. Please include '@' and a valid domain.", "error");
    }
  
    if ((name === "phone" || name === "phone_number") && !isValidPhoneNumber(value)) {
      showToast("Phone number must start with '09' and be exactly 11 digits.", "error");
  
      if (formType === "appointment") {
        setAppointmentData({ ...appointmentData, phone_number: "" });
      } else {
        setInquiryData({ ...inquiryData, phone: "" });
      }
    }
  };
  

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 dark:text-white p-6 shadow-lg rounded-lg">      
    <SEOComponent />
      {/* ✅ Tabs for Inquiry & Appointment */}
      <div className="flex justify-between border-b pb-2 mb-4 dark:border-gray-600">
        <button
          className={`w-1/2 text-center py-2 ${activeTab === "appointment" ? "text-[#990e15] font-bold border-b-2 border-[#990e15]" : "text-gray-600"}`}
          onClick={() => setActiveTab("appointment")}
        >
          Appointment
        </button>
        <button
          className={`w-1/2 text-center py-2 ${activeTab === "inquiry" ? "text-[#990e15] font-bold border-b-2 border-[#990e15]" : "text-gray-600"}`}
          onClick={() => setActiveTab("inquiry")}
        >
          Inquiry
        </button>
      </div>

      {/* ✅ Appointment Form */}
      {activeTab === "appointment" && (
        <form onSubmit={(e) => handleSubmit(e, "appointment")} className="grid gap-3">
          <input type="text" name="first_name" value={appointmentData.first_name} onChange={(e) => handleChange(e, "appointment")} placeholder="First Name" className="input-field" required />
          <input type="text" name="last_name" value={appointmentData.last_name} onChange={(e) => handleChange(e, "appointment")} placeholder="Last Name" className="input-field" required />
          <input type="email" name="email" value={appointmentData.email}   onChange={(e) => handleChange(e, "appointment")} onBlur={(e) => handleBlur(e, "appointment")} placeholder="Email" className="input-field" required />
          <input type="text" name="phone_number" value={appointmentData.phone_number}   maxLength="11" onChange={(e) => handleChange(e, "appointment")} onBlur={(e) => handleBlur(e, "appointment")}   placeholder="Phone Number (e.g. 09123456789)"  className="w-full p-2 border rounded-md placeholder:text-gray-400 input-field placeholder:text-sm" required />
          <input type="date" name="appointment_date" value={appointmentData.appointment_date} onChange={(e) => handleChange(e, "appointment")} className="input-field" required />
          <input type="time" name="appointment_time" value={appointmentData.appointment_time} onChange={(e) => handleChange(e, "appointment")} className="input-field" required />
          <textarea name="message" value={appointmentData.message} onChange={(e) => handleChange(e, "appointment")}  placeholder="Briefly describe your concern or question (e.g. unit details, job inquiry, schedule)"
 className="input-field" rows="3"></textarea>
          <button type="submit" className="submit-btn">{loading ? "Booking..." : "Submit Appointment"}</button>
        </form>
      )}

      {/* ✅ Inquiry Form */}
      {activeTab === "inquiry" && (
        <form onSubmit={(e) => handleSubmit(e, "inquiry")} className="grid gap-3">
          <input type="text" name="first_name" value={inquiryData.first_name} onChange={(e) => handleChange(e, "inquiry")} placeholder="First Name" className="input-field" required />
          <input type="text" name="last_name" value={inquiryData.last_name} onChange={(e) => handleChange(e, "inquiry")} placeholder="Last Name" className="input-field" required />
          <input type="email" name="email" value={inquiryData.email}   onChange={(e) => handleChange(e, "inquiry")}
  onBlur={(e) => handleBlur(e, "inquiry")} placeholder="Email" className="input-field" required />
          <input type="text" name="phone" value={inquiryData.phone}   onChange={(e) => handleChange(e, "inquiry")} onBlur={(e) => handleBlur(e, "inquiry") }  maxLength="11"   placeholder="Phone Number (e.g. 09123456789)"  className="w-full p-2 border rounded-md placeholder:text-gray-400 input-field placeholder:text-sm" required />
          <select name="inquiry_type" value={inquiryData.inquiry_type} onChange={(e) => handleChange(e, "inquiry")} className="input-field">
            <option value="">Select Inquiry Type</option>
            <option value="Sales">Sales Inquiry</option>
            <option value="Leasing">Leasing Inquiry</option>
          </select>
          <textarea name="message" value={inquiryData.message} onChange={(e) => handleChange(e, "inquiry")}  placeholder="Briefly describe your concern or question (e.g. unit details, job inquiry, schedule)"
 className="input-field" rows="3"></textarea>
          <button type="submit" className="submit-btn">{loading ? "Sending..." : "Submit Inquiry"}</button>
        </form>
      )}
      <ConfirmDialog />

    </div>
    
  );
}
