import { useState, useEffect } from "react";
import Link from "next/link";
import DesktopNav from "../components/user/desktopnav";
import MobileNav from "../components/user/mobilenav";
import { X, Menu, ChevronDown, Sun, Moon, Download } from "lucide-react";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

  // ✅ Handle PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent auto-popup
      setDeferredPrompt(event); // Store event to trigger manually
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // ✅ Function to Show Install Prompt
  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installed successfully");
        } else {
          console.log("PWA installation declined");
        }
        setDeferredPrompt(null); // Reset prompt
      });
    }
  };

  return (
    <header className="header header-container shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300 flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900">

      {/* Brand / Logo */}
      <Link href="/home" className="text-2xl font-extrabold text-[#990e15] dark:text-white">
        AvidaRealEstate
      </Link>

      {/* Navigation */}
      {isMobile ? <MobileNav /> : <DesktopNav />}

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="ml-4 p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* PWA Install Button */}
      {deferredPrompt && (
        <button
          onClick={installPWA}
          className="ml-4 px-4 py-2 flex items-center bg-[#990e15] text-white rounded-lg shadow-md hover:bg-[#7f0c12] transition-all"
        >
          <Download size={20} className="mr-2" />
          Install App
        </button>
      )}
    </header>
  );
}
