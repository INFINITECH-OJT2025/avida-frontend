import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#990e15] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-extrabold">AvidaRealEstate</h2>
          <p className="text-gray-300 mt-2 text-sm">
            Helping you find the perfect home with unmatched quality and dedication.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/properties" className="hover:text-white transition">Properties</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-3">Contact Us</h3>
          <p className="text-gray-300">📍 123 Real Estate Street, Metro Manila, PH</p>
          <p className="text-gray-300">📞 +63 912 345 6789</p>
          <p className="text-gray-300">📧 info@avidarealestate.com</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 text-center text-gray-300 border-t border-gray-600 pt-4">
        <p>© {new Date().getFullYear()} AvidaRealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
}
