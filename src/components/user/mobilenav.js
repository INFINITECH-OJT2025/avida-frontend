import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { X, Menu, ChevronDown, Sun, Moon, Download } from "lucide-react";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const isActive = (path) => router.pathname === path;

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

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

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

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstalled(false);
    });

    window.addEventListener("appinstalled", () => {
      setIsPwaInstalled(true);
    });
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsPwaInstalled(true);
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      {/* Header Bar */}
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-between px-6 py-4 z-50">
        <Link href="/home" className="text-xl font-bold text-[#990e15] dark:text-white">
          AvidaRealEstate
        </Link>

        <div className="flex items-center space-x-4">
          {!isPwaInstalled && deferredPrompt && (
            <button onClick={installPWA} className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
              <Download size={20} />
            </button>
          )}
          <button onClick={toggleDarkMode} className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-900 dark:text-white">
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Slide-in Drawer */}
      {isMenuOpen && (
        <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      
      <div className="flex justify-start p-4">
  <button onClick={() => setIsMenuOpen(false)} className="text-gray-900 dark:text-white">
    <X size={28} />
  </button>
</div>


          <nav className="space-y-1 px-4">
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
                onClick={() => setIsMenuOpen(false)}
                className={`nav-item block py-2 px-4 rounded-md text-sm font-medium ${
                  isActive(path) ? "bg-[#990e15] text-white" : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Dropdown Section */}
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`nav-item w-full flex justify-between items-center py-2 px-4 rounded-md text-sm font-medium ${
                  isActive("/user/submit-property") || isActive("/loancalculator") || isActive("/contact-us")
                    ? "bg-[#990e15] text-white"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                Forms & Utilities <ChevronDown size={18} />
              </button>

              {isDropdownOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {[
                    { path: "/user/submit-property", label: "Submit Property" },
                    { path: "/loancalculator", label: "Loan Calculator" },
                    { path: "/contact-us", label: "Contact Us" },
                  ].map(({ path, label }) => (
                    <Link
                      key={path}
                      href={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-1 px-3 text-sm rounded-md ${
                        isActive(path) ? "bg-[#990e15] text-white" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
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
