import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DesktopNav from "../components/user/desktopnav";
import MobileNav from "../components/user/mobilenav";
import { X, Menu, ChevronDown, Sun, Moon } from "lucide-react";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Function to check screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if width is < 768px
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Listen for screen resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener
    };
  }, []);

  // ✅ Check localStorage for dark mode preference
  useEffect(() => {
    if (localStorage.theme === "dark") {
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
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="header header-container shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">

  <Link href="/home" className="text-2xl font-extrabold text-[#990e15] dark:text-white">
    AvidaRealEstate
  </Link>
  {isMobile ? <MobileNav /> : <DesktopNav />}
  <button
    onClick={toggleDarkMode}
    className="ml-4 p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all"
  >
    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
  </button>
</header>

  );
}
