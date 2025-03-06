import { useState } from "react";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi"; // ✅ Import icons

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#990e15] cursor-pointer" onClick={() => router.push("/")}>
          Avida<span className="text-gray-800">Land</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => router.push("/")} className="text-gray-700 hover:text-[#990e15] transition">Home</button>
          <button onClick={() => router.push("/properties")} className="text-gray-700 hover:text-[#990e15] transition">Properties</button>
          <button onClick={() => router.push("/about")} className="text-gray-700 hover:text-[#990e15] transition">About Us</button>
          <button onClick={() => router.push("/contact")} className="text-gray-700 hover:text-[#990e15] transition">Contact</button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX className="text-3xl cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <FiMenu className="text-3xl cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full">
          <nav className="flex flex-col space-y-4 py-4 text-center">
            <button onClick={() => {router.push("/"); setMenuOpen(false);}} className="text-gray-700 hover:text-[#990e15] transition">Home</button>
            <button onClick={() => {router.push("/properties"); setMenuOpen(false);}} className="text-gray-700 hover:text-[#990e15] transition">Properties</button>
            <button onClick={() => {router.push("/about"); setMenuOpen(false);}} className="text-gray-700 hover:text-[#990e15] transition">About Us</button>
            <button onClick={() => {router.push("/contact"); setMenuOpen(false);}} className="text-gray-700 hover:text-[#990e15] transition">Contact</button>
          </nav>
        </div>
      )}
    </header>
  );
}
