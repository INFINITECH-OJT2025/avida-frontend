import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { X, Menu, ChevronDown, Sun, Moon } from "lucide-react";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  // ✅ Check if a link is active
  const isActive = (path) => router.pathname === path;

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  // ✅ Load Dark Mode preference from localStorage
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // ✅ Toggle Dark Mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <>
      {/* ✅ Mobile Header Bar */}
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-between px-6 py-4 z-50">
        {/* Logo */}
        <Link href="/home" className="text-xl font-bold text-[#990e15] dark:text-white">
          AvidaRealEstate
        </Link>

        <div className="flex items-center space-x-4">
          {/* ✅ Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* ✅ Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-900 dark:text-white"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* ✅ Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`fixed top-0 left-0 w-72 h-full bg-white dark:bg-gray-900 shadow-lg transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          {/* ✅ Close Button (Now Positioned to the Right) */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 dark:text-white"
            >
              <X size={28} />
            </button>
          </div>

          {/* ✅ Navigation Links */}
          <nav className="space-y-1">
            {[
              { path: "/home", label: "Home" },
              { path: "/properties", label: "Properties" },
              { path: "/about-us", label: "About Us" },
              { path: "/news", label: "News and Updates" },
              { path: "/careers", label: "Careers" },
              { path: "/services", label: "Services" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`nav-item ${isActive(path) ? "nav-active" : ""}`}
                onClick={() => setIsMenuOpen(false)} // ✅ Close menu when clicking
              >
                {label}
              </Link>
            ))}

            {/* ✅ Forms & Utilities Dropdown */}
            <div>
              <button
                className={`nav-item flex justify-between items-center ${isActive("/user/submit-property") || isActive("/loancalculator") ? "nav-active" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Forms & Utilities <ChevronDown size={18} />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-mobile">
                  <Link
                    href="/user/submit-property"
                    className={`dropdown-item ${isActive("/user/submit-property") ? "dropdown-active" : ""}`}
                    onClick={() => setIsMenuOpen(false)} // ✅ Close menu on click
                  >
                    Submit Property
                  </Link>
                  <Link
                    href="/loancalculator"
                    className={`dropdown-item ${isActive("/loancalculator") ? "dropdown-active" : ""}`}
                    onClick={() => setIsMenuOpen(false)} // ✅ Close menu on click
                  >
                    Loan Calculator
                  </Link>
                  <Link
                    href="/contact-us"
                    className={`dropdown-item ${isActive("/contact-us") ? "dropdown-active" : ""}`}
                    onClick={() => setIsMenuOpen(false)} // ✅ Close menu on click
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
