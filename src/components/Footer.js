import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/contacts");
        setContacts(res.data[0]);
      } catch (err) {
        setError("Failed to load contact details.");
      }
    }
    fetchContacts();
  }, []);

  return (
    <footer className="bg-[#990e15] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand & About */}
        <div>
          <h2 className="text-3xl font-extrabold">AvidaRealEstate</h2>
          <p className="text-gray-300 mt-3 text-sm leading-relaxed">
            Helping you find the perfect home with unmatched quality and dedication.
          </p>
          {/* Social Media Links */}
          {contacts && (
            <div className="flex space-x-4 mt-4">
              {contacts.facebook_link && (
                <a href={contacts.facebook_link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <FaFacebookF size={18} />
                </a>
              )}
              {contacts.linkedin_link && (
                <a href={contacts.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <FaLinkedin size={18} />
                </a>
              )}
              {contacts.instagram_link && (
                <a href={contacts.instagram_link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <FaInstagram size={18} />
                </a>
              )}
              {contacts.youtube_link && (
                <a href={contacts.youtube_link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <FaYoutube size={18} />
                </a>
              )}
              {contacts.tiktok_link && (
                <a href={contacts.tiktok_link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <FaTiktok size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick Links - Matches Header Navigation */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/home" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/properties" className="hover:text-white transition">Properties</Link></li>
            <li><Link href="/about-us" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/news" className="hover:text-white transition">News & Updates</Link></li>
            <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
            <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
          </ul>
        </div>

        {/* Forms & Utilities Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Forms & Utilities</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/user/submit-property" className="hover:text-white transition">Submit Property</Link></li>
            <li><Link href="/loancalculator" className="hover:text-white transition">Loan Calculator</Link></li>
            <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {contacts ? (
            <>
              {contacts.address && (
                <p className="text-gray-300"><strong>📍 Office:</strong> {contacts.address}</p>
              )}
              {contacts.main_phone && (
                <p className="text-gray-300 mt-1">
                  <strong><FaPhone className="inline-block" /> Hotline:</strong> {contacts.main_phone}
                </p>
              )}
              {contacts.email && (
                <p className="text-gray-300 mt-1">
                  <strong><FaEnvelope className="inline-block" /> Email:</strong> {contacts.email}
                </p>
              )}
              <hr className="border-t border-gray-300 my-4" />

              <h1 className="text-lg font-semibold mb-2">Other Concerns</h1>
              {contacts.sales_phone && (
                <p className="text-gray-300">
                  <strong><FaPhone className="inline-block" /> Sales:</strong> {contacts.sales_phone}
                </p>
              )}
              {contacts.leasing_phone && (
                <p className="text-gray-300">
                  <strong><FaPhone className="inline-block" /> Leasing:</strong> {contacts.leasing_phone}
                </p>
              )}
              {contacts.employment_phone && (
                <p className="text-gray-300">
                  <strong><FaPhone className="inline-block" /> Employment:</strong> {contacts.employment_phone}
                </p>
              )}
              {contacts.customer_care_phone && (
                <p className="text-gray-300">
                  <strong><FaPhone className="inline-block" /> Customer Care:</strong> {contacts.customer_care_phone}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-300">Loading contact details...</p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 text-center text-gray-300 border-t border-gray-600 pt-4">
        <p>© {new Date().getFullYear()} AvidaRealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
}
