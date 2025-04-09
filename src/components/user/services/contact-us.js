import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMobile,
  FaMapMarkerAlt,
  FaBuilding
} from "react-icons/fa";
import { useToast } from "../../../context/ToastContext";
import { fetchContacts, submitInquiry } from "../../../utils/api";

export default function ContactForm() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (err) {
        showToast("Failed to load contact details.", "error");
      }
    };
    fetchContact();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };
  const isValidPhoneNumber = (phone) => /^09\d{9}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, ""); // remove non-digits
      if (cleaned.length <= 11) {
        setFormData({ ...formData, phone: cleaned });
      }
      return;
    }
    
    if (name === "email") {
      const trimmed = value.trim();
      setFormData({ ...formData, email: trimmed });
      return;
    }
  
    setFormData({ ...formData, [name]: value });
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
  
    if (name === "phone") {
      if (!isValidPhoneNumber(value)) {
        showToast("Phone number must start with '09' and be exactly 11 digits.", "error");
        setFormData({ ...formData, phone: "" });
      }
    }
    
    if (name === "email") {
      const trimmed = value.trim();
      if (!isValidEmail(trimmed)) {
        showToast("Invalid email format. Please include '@' and a valid domain.", "error");
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isValidPhoneNumber(formData.phone)) {
      showToast("Invalid phone number. Please enter a valid 11-digit number starting with '09'.", "error");
      setLoading(false);
      return;
    }
    
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      inquiry_type: formData.inquiryType,
      message: formData.message,
    };

    try {
      const response = await submitInquiry(payload);

      if (response?.success || response?.message?.includes("successfully")) {
        showToast(response.message || "Inquiry submitted successfully!", "success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          inquiryType: "",
          message: "",
        });
      } else {
        showToast(response?.message || "Unexpected response from server.", "error");
      }
    } catch (err) {
      const fallback = err?.response?.data;
      if (fallback?.errors) {
        const msg = Object.values(fallback.errors).flat().join(" ");
        showToast(msg, "error");
      } else if (fallback?.message) {
        showToast(fallback.message, "error");
      } else {
        showToast("Something went wrong. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      {/* Left - Contact Info */}
      <div className="bg-[#990e15] text-white p-6 rounded-lg text-sm space-y-4">
        <h2 className="text-2xl font-bold">Connect with us</h2>
        <p>Our agents are here to assist you in finding the perfect home or property.</p>

        {contacts.length > 0 && (
          <div className="space-y-6">
            {/* Office Address & Hotline */}
            <div className="space-y-3 pl-1"> {/* Adjust this to shift icons and text slightly left */}
              {contacts[0].address && (
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-6 h-6 mt-0.5 min-w-[15px] text-left" />
                  <p className="leading-relaxed"><strong className="inline-block pr-1">Office: </strong> {contacts[0].address}</p>
                </div>
              )}
              {contacts[0].main_phone && (
                <div className="flex items-start gap-2">
                  <FaPhone className="w-4 h-4 mt-0.5 min-w-[20px] text-center" />
                  <p><strong className="inline-block pr-1">Hotline: </strong> {contacts[0].main_phone}</p>
                </div>
              )}
            </div>


            {/* Other Concerns */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Other Concerns</h3>
              {contacts[0].sales_phone && (
                <div className="flex items-center gap-2">
                  <FaMobile className="w-4 h-4" />
                  <p><strong>Sales: </strong> {contacts[0].sales_phone}</p>
                </div>
              )}
              {contacts[0].leasing_phone && (
                <div className="flex items-center gap-2">
                  <FaMobile className="w-4 h-4" />
                  <p><strong>Leasing: </strong> {contacts[0].leasing_phone}</p>
                </div>
              )}
              {contacts[0].employment_phone && (
                <div className="flex items-center gap-2">
                  <FaMobile className="w-4 h-4" />
                  <p><strong>Employment: </strong> {contacts[0].employment_phone}</p>
                </div>
              )}
              {contacts[0].customer_care_phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="w-4 h-4" />
                  <p><strong>Customer Care: </strong> {contacts[0].customer_care_phone}</p>
                </div>
              )}
              {contacts[0].email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  <p><strong>Email: </strong> {contacts[0].email}</p>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex items-center gap-4">
                {contacts[0].facebook_link && (
                  <a href={contacts[0].facebook_link} title="Facebook" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="w-5 h-5 hover:text-gray-300 hover:scale-110 transition duration-200" />
                  </a>
                )}
                {contacts[0].linkedin_link && (
                  <a href={contacts[0].linkedin_link} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="w-5 h-5 hover:text-gray-300 hover:scale-110 transition duration-200" />
                  </a>
                )}
                {contacts[0].instagram_link && (
                  <a href={contacts[0].instagram_link} title="Instagram" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="w-5 h-5 hover:text-gray-300 hover:scale-110 transition duration-200" />
                  </a>
                )}
                {contacts[0].youtube_link && (
                  <a href={contacts[0].youtube_link} title="YouTube" target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="w-5 h-5 hover:text-gray-300 hover:scale-110 transition duration-200" />
                  </a>
                )}
                {contacts[0].tiktok_link && (
                  <a href={contacts[0].tiktok_link} title="TikTok" target="_blank" rel="noopener noreferrer">
                    <FaTiktok className="w-5 h-5 hover:text-gray-300 hover:scale-110 transition duration-200" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Right - Inquiry Form */}
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-sm">
        <h2 className="text-xl font-bold text-[#990e15] dark:text-white text-center">Send an Inquiry</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">Fill out the form and we'll get back to you.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="input-field">
            <option value="">Select an inquiry type</option>
            <option value="Sales">Sales Inquiry</option>
            <option value="Leasing">Leasing Inquiry</option>
          </select>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input-field" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input-field" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange}  onBlur={handleBlur} placeholder="Email" className="input-field" required />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Phone Number (e.g. 09123456789)"
            className="input-field"
            required
            maxLength="11"
          />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." className="input-field" rows="3" required></textarea>
          <button type="submit" className="submit-btn">{loading ? "Sending..." : "Send Inquiry"}</button>
        </form>
      </div>
    </div>
  );
}
