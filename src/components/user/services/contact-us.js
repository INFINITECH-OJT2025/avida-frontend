import { useState, useEffect } from "react";
import axios from "axios";
import { FaFacebook, FaLinkedin, FaInstagram, FaTiktok, FaYoutube, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactForm() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
    });

    // Fetch contact details from Laravel API
    useEffect(() => {
        async function fetchContact() {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/contacts");
                setContacts(res.data);
            } catch (err) {
                setError("Failed to load contact details.");
            }
        }
        fetchContact();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResponseMessage("");

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            inquiry_type: formData.inquiryType,
            message: formData.message,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage("Inquiry submitted successfully!");
                setFormData({ firstName: "", lastName: "", email: "", phone: "", inquiryType: "", message: "" });
            } else {
                setError(data.errors ? Object.values(data.errors).join(" ") : "Something went wrong.");
            }
        } catch (error) {
            setError("Network error. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">

            {/* Left Section - Contact Information */}
            <div className="bg-[#990e15] text-white p-6 rounded-lg text-sm">
                <h2 className="text-2xl font-bold mb-3">Connect with us</h2>
                <p className="mb-3">Our agents are here to assist you in finding the perfect home or property.</p>
                <hr className="border-t border-gray-300 my-4" />

                {contacts.length > 0 && (
                    <div>
                        {contacts[0].address && <p><strong>📍 Office:</strong> {contacts[0].address}</p>}
                        {contacts[0].main_phone && <p><strong><FaPhone className="inline-block" /> Hotline:</strong> {contacts[0].main_phone}</p>}
                        <hr className="border-t border-gray-300 my-4" />

                        <h1 className="mb-2"><strong>Other Concerns</strong></h1>
                        {contacts[0].sales_phone && <p><strong><FaPhone className="inline-block" /> Sales:</strong> {contacts[0].sales_phone}</p>}
                        {contacts[0].leasing_phone && <p><strong><FaPhone className="inline-block" /> Leasing:</strong> {contacts[0].leasing_phone}</p>}
                        {contacts[0].employment_phone && <p><strong><FaPhone className="inline-block" /> Employment:</strong> {contacts[0].employment_phone}</p>}
                        {contacts[0].customer_care_phone && <p><strong><FaPhone className="inline-block" /> Customer Care:</strong> {contacts[0].customer_care_phone}</p>}
                        {contacts[0].email && <p><strong><FaEnvelope className="inline-block" /> Email:</strong> {contacts[0].email}</p>}
                        <hr className="border-t border-gray-300 my-4" />

                        {/* Social Media Links */}
                        <h1 className="mb-2"><strong>Follow Us</strong></h1>
                        <div className="flex space-x-3">
                            {contacts[0].facebook_link && <a href={contacts[0].facebook_link} target="_blank" rel="noopener noreferrer"><FaFacebook className="w-5 h-5 hover:text-gray-300" /></a>}
                            {contacts[0].linkedin_link && <a href={contacts[0].linkedin_link} target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-5 h-5 hover:text-gray-300" /></a>}
                            {contacts[0].instagram_link && <a href={contacts[0].instagram_link} target="_blank" rel="noopener noreferrer"><FaInstagram className="w-5 h-5 hover:text-gray-300" /></a>}
                            {contacts[0].youtube_link && <a href={contacts[0].youtube_link} target="_blank" rel="noopener noreferrer"><FaYoutube className="w-5 h-5 hover:text-gray-300" /></a>}
                            {contacts[0].tiktok_link && <a href={contacts[0].tiktok_link} target="_blank" rel="noopener noreferrer"><FaTiktok className="w-5 h-5 hover:text-gray-300" /></a>}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Section - Inquiry Form */}
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-sm">
                <h2 className="text-xl font-bold text-[#990e15] dark:text-white text-center">Send an Inquiry</h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">Fill out the form and we'll get back to you.</p>

                {responseMessage && <p className="text-center text-green-600">{responseMessage}</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="input-field">
                        <option value="">Select an inquiry type</option>
                        <option value="Sales">Sales Inquiry</option>
                        <option value="Leasing">Leasing Inquiry</option>
                    </select>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input-field" required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input-field" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-field" required />
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." className="input-field" rows="3" required></textarea>
                    <button type="submit" className="submit-btn">
                        {loading ? "Sending..." : "Send Inquiry"}
                    </button>
                </form>
            </div>
        </div>
    );
}
