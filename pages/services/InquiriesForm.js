import { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [activeTab, setActiveTab] = useState("appointment"); // Default to Appointment tab
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

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
    phone_number: "",
    inquiry_type: "",
    message: "",
  });

  // ✅ Handle Input Changes
  const handleChange = (e, formType) => {
    if (formType === "appointment") {
      setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    } else {
      setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    const endpoint =
      formType === "appointment"
        ? "http://127.0.0.1:8000/api/appointments"
        : "http://127.0.0.1:8000/api/inquiries";

    const payload = formType === "appointment" ? appointmentData : inquiryData;

    try {
      await axios.post(endpoint, payload);
      setResponseMessage(
        formType === "appointment" ? "Appointment booked successfully!" : "Inquiry submitted successfully!"
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
      setResponseMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
      {/* ✅ Tabs for Inquiry & Appointment */}
      <div className="flex justify-between border-b pb-2 mb-4 dark:border-gray-600">
        <button
          className={`w-1/2 text-center py-2 ${activeTab === "appointment" 
            ? "text-[#990e15] font-bold border-b-2 border-[#990e15] dark:border-[#ff6666]" 
            : "text-gray-600 dark:text-gray-300"}`}
          onClick={() => setActiveTab("appointment")}
        >
          Appointment
        </button>
        <button
          className={`w-1/2 text-center py-2 ${activeTab === "inquiry" 
            ? "text-[#990e15] font-bold border-b-2 border-[#990e15] dark:border-[#ff6666]" 
            : "text-gray-600 dark:text-gray-300"}`}
          onClick={() => setActiveTab("inquiry")}
        >
          Inquiry
        </button>
      </div>

      {/* ✅ Response Message */}
      {responseMessage && <p className="text-center text-green-600 dark:text-green-400">{responseMessage}</p>}

      {/* ✅ Appointment Form */}
      {activeTab === "appointment" && (
        <form onSubmit={(e) => handleSubmit(e, "appointment")} className="grid gap-3">
          <input type="text" name="first_name" value={appointmentData.first_name} 
            onChange={(e) => handleChange(e, "appointment")} placeholder="First Name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="text" name="last_name" value={appointmentData.last_name} 
            onChange={(e) => handleChange(e, "appointment")} placeholder="Last Name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="email" name="email" value={appointmentData.email} 
            onChange={(e) => handleChange(e, "appointment")} placeholder="Email"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="text" name="phone_number" value={appointmentData.phone_number} 
            onChange={(e) => handleChange(e, "appointment")} placeholder="Phone Number"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="date" name="appointment_date" value={appointmentData.appointment_date} 
            onChange={(e) => handleChange(e, "appointment")}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="time" name="appointment_time" value={appointmentData.appointment_time} 
            onChange={(e) => handleChange(e, "appointment")}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <textarea name="message" value={appointmentData.message} 
            onChange={(e) => handleChange(e, "appointment")} placeholder="Leave us a message..."
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3"></textarea>
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            {loading ? "Booking..." : "Submit Appointment"}
          </button>
        </form>
      )}

      {/* ✅ Inquiry Form */}
      {activeTab === "inquiry" && (
        <form onSubmit={(e) => handleSubmit(e, "inquiry")} className="grid gap-3">
          <input type="text" name="first_name" value={inquiryData.first_name} 
            onChange={(e) => handleChange(e, "inquiry")} placeholder="First Name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="text" name="last_name" value={inquiryData.last_name} 
            onChange={(e) => handleChange(e, "inquiry")} placeholder="Last Name"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="email" name="email" value={inquiryData.email} 
            onChange={(e) => handleChange(e, "inquiry")} placeholder="Email"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input type="text" name="phone" value={inquiryData.phone} 
            onChange={(e) => handleChange(e, "inquiry")} placeholder="Phone Number"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <select name="inquiry_type" value={inquiryData.inquiry_type} 
            onChange={(e) => handleChange(e, "inquiry")}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Select Inquiry Type</option>
            <option value="Sales">Sales Inquiry</option>
            <option value="Leasing">Leasing Inquiry</option>
          </select>
          <textarea name="message" value={inquiryData.message} 
            onChange={(e) => handleChange(e, "inquiry")} placeholder="Leave us a message..."
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3"></textarea>
          <button type="submit" className="submit-btn dark:bg-[#990e15] dark:hover:bg-red-700">
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}
