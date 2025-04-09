import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMobile,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getPublicContacts } from "../../src/utils/api";

export default function Footer({ companySlogan }) {
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getPublicContacts();
        setContacts(data[0]);
      } catch (err) {
        console.error("Contact API Error:", err);
        setError("⚠️ Failed to load contact details.");
      }
    };

    loadContacts();
  }, []);

  return (
    <footer className="bg-[#990e15] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* Brand Section */}
        <div>
          <img src="/Avida_dm.svg" alt="AvidaRealEstate Logo" className="w-32 mb-4" />
          <p className="text-gray-300 text-xsm italic leading-relaxed">
            {companySlogan || "Helping you find the perfect home with unmatched quality and dedication."}
          </p>
          {contacts && (
            <div className="flex space-x-4 mt-4">
              {contacts.facebook_link && <a href={contacts.facebook_link} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>}
              {contacts.linkedin_link && <a href={contacts.linkedin_link} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
              {contacts.instagram_link && <a href={contacts.instagram_link} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
              {contacts.youtube_link && <a href={contacts.youtube_link} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
              {contacts.tiktok_link && <a href={contacts.tiktok_link} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/home">Home</Link></li>
            <li><Link href="/properties">Properties</Link></li>
            <li><Link href="/about-us">About Us</Link></li>
            <li><Link href="/news">News & Updates</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>

        {/* Utilities */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Forms & Utilities</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/user/submit-property">Submit Property</Link></li>
            <li><Link href="/loancalculator">Loan Calculator</Link></li>
            <li><Link href="/contact-us">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            {contacts?.address && (
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-2xl mt-[2px] min-w-[1.5rem]" />
                <span><strong>Office:</strong> {contacts.address}</span>
              </li>
            )}
            {contacts?.main_phone && (
              <li className="flex items-start gap-3">
                <FaPhone className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Hotline:</strong> {contacts.main_phone}</span>
              </li>
            )}
            {contacts?.email && (
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Email:</strong> {contacts.email}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Other Concerns */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Other Concerns</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            {contacts?.sales_phone && (
              <li className="flex items-start gap-3">
                <FaMobile className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Sales:</strong> {contacts.sales_phone}</span>
              </li>
            )}
            {contacts?.leasing_phone && (
              <li className="flex items-start gap-3">
                <FaMobile className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Leasing:</strong> {contacts.leasing_phone}</span>
              </li>
            )}
            {contacts?.employment_phone && (
              <li className="flex items-start gap-3">
                <FaMobile className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Employment:</strong> {contacts.employment_phone}</span>
              </li>
            )}
            {contacts?.customer_care_phone && (
              <li className="flex items-start gap-3">
                <FaPhone className="text-xl mt-[2px] min-w-[1.25rem]" />
                <span><strong>Customer Care:</strong> {contacts.customer_care_phone}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-300 border-t border-gray-600 pt-4">
        <p>© {new Date().getFullYear()} AvidaRealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
}