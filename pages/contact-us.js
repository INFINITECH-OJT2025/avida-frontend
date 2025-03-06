import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { FaFacebook, FaLinkedin, FaInstagram, FaTiktok, FaYoutube, FaPhone, FaEnvelope } from "react-icons/fa";
import Header from "@/components/Header";

export default function ContactInquiry() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
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
            first_name: formData.firstName, // ✅ Match Laravel API field names
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
        <>
            <Head>
                <title>Contact Us | Avida</title>
                <meta name="description" content="Get in touch with Avida Realty for property sales, leasing, and customer support." />
            </Head>

            <Header />

            <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
                <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-10">

                    {/* Left Section - Contact Information */}
                    <div className="bg-[#990e15] text-white p-8 rounded-lg">
                        <h2 className="text-3xl font-bold mb-4">Connect with us</h2>
                        <p className="mb-4">Our agents are here to assist you in finding the perfect home or property.</p>
                        <hr className="border-t-2 border-gray-300 my-6" />

                        {contacts.length > 0 && (
                            <div>
                                {contacts[0].address && <p><strong>📍 Office:</strong> {contacts[0].address}</p>}
                                {contacts[0].main_phone && <p><strong><FaPhone className="inline-block" /> Office Hotline:</strong> {contacts[0].main_phone}</p>}
                                <hr className="border-t-2 border-gray-300 my-6" />

                                <h1 className="mb-2"><strong>For Other Concerns</strong></h1>
                                {contacts[0].sales_phone && <p><strong><FaPhone className="inline-block" /> Sales:</strong> {contacts[0].sales_phone}</p>}
                                {contacts[0].leasing_phone && <p><strong><FaPhone className="inline-block" /> Leasings:</strong> {contacts[0].leasing_phone}</p>}
                                {contacts[0].employment_phone && <p><strong><FaPhone className="inline-block" /> Employment Inquiry:</strong> {contacts[0].employment_phone}</p>}
                                {contacts[0].customer_care_phone && <p><strong><FaPhone className="inline-block" /> Customer Care (Phone):</strong> {contacts[0].customer_care_phone}</p>}
                                {contacts[0].customer_care_landline && <p><strong><FaPhone className="inline-block" /> Customer Care (Landline):</strong> {contacts[0].customer_care_landline}</p>}
                                {contacts[0].email && <p><strong><FaEnvelope className="inline-block" /> Email:</strong> {contacts[0].email}</p>}
                                {contacts[0].support_email && <p><strong>📩 Support:</strong> {contacts[0].support_email}</p>}
                                {contacts[0].business_hours && <p><strong>🕒 Hours:</strong> {contacts[0].business_hours}</p>}
                                <hr className="border-t-2 border-gray-300 my-6" />

                                {/* Social Media Links */}
                                <h1 className="mb-2"><strong>Follow Us on Social Media</strong></h1>
                                <div className="flex space-x-4 mt-4">
                                    {contacts[0].facebook_link && (
                                        <a href={contacts[0].facebook_link} target="_blank" rel="noopener noreferrer">
                                            <FaFacebook className="w-6 h-6 hover:text-gray-300" />
                                        </a>
                                    )}
                                    {contacts[0].linkedin_link && (
                                        <a href={contacts[0].linkedin_link} target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin className="w-6 h-6 hover:text-gray-300" />
                                        </a>
                                    )}
                                    {contacts[0].instagram_link && (
                                        <a href={contacts[0].instagram_link} target="_blank" rel="noopener noreferrer">
                                            <FaInstagram className="w-6 h-6 hover:text-gray-300" />
                                        </a>
                                    )}
                                    {contacts[0].youtube_link && (
                                        <a href={contacts[0].youtube_link} target="_blank" rel="noopener noreferrer">
                                            <FaYoutube className="w-6 h-6 hover:text-gray-300" />
                                        </a>
                                    )}
                                    {contacts[0].tiktok_link && (
                                        <a href={contacts[0].tiktok_link} target="_blank" rel="noopener noreferrer">
                                            <FaTiktok className="w-6 h-6 hover:text-gray-300" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Inquiry Form */}
                    <div className="bg-gray-100 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-[#990e15] text-center">Send an Inquiry</h2>
                        <p className="text-gray-600 text-center mb-6">Fill out the form and we'll get back to you.</p>

                        {responseMessage && <p className="text-center text-green-600">{responseMessage}</p>}
                        {error && <p className="text-center text-red-600">{error}</p>}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full p-3 border rounded-lg">
                                <option value="">Select an inquiry type</option>
                                <option value="Sales">Sales Inquiry</option>
                                <option value="Leasing">Leasing Inquiry</option>
                                <option value="Customer Care">Customer Care Concerns</option>
                                <option value="General">Other Concerns</option>
                            </select>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-3 border rounded-lg" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-lg" required />
                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." className="w-full p-3 border rounded-lg" rows="4" required></textarea>
                            <button type="submit" className="bg-[#990e15] text-white px-6 py-3 rounded-lg w-full hover:bg-red-800">
                                {loading ? "Sending..." : "Send Inquiry"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
