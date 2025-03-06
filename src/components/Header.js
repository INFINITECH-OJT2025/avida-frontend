import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/home" className="text-2xl font-extrabold text-[#990e15]">
          AvidaRealEstate
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/home" className="hover:text-[#990e15] transition">Home</Link>
          <Link href="/properties" className="hover:text-[#990e15] transition">Properties</Link>
          <Link href="/sell" className="hover:text-[#990e15] transition">Contact Us </Link>
          <Link href="/news" className="hover:text-[#990e15] transition">News and Updates</Link>
          <Link href="/find-agent" className="hover:text-[#990e15] transition">Find an Agent</Link>


          {/* Buy & Rent Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >

            <button className="hover:text-[#990e15] transition">Forms & Utilities ▼</button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white border shadow-md rounded-md z-50">
                <Link href="/user/submit-property" className="block px-4 py-2 hover:bg-gray-100">Submit Property</Link>
                <Link href="/loancalculator" className="block px-4 py-2 hover:bg-gray-100">Loan Calculator</Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <Link href="/buy" className="block px-6 py-3 border-b hover:bg-gray-100">Buy</Link>
          <Link href="/rent" className="block px-6 py-3 border-b hover:bg-gray-100">Rent</Link>
          <Link href="/sell" className="block px-6 py-3 border-b hover:bg-gray-100">Sell</Link>
          <Link href="/home-loans" className="block px-6 py-3 border-b hover:bg-gray-100">Home Loans</Link>
          <Link href="/find-agent" className="block px-6 py-3 border-b hover:bg-gray-100">Find an Agent</Link>
        </div>
      )}
    </header>
  );
}
