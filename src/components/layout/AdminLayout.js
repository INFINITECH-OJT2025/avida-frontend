import { useState, useEffect } from "react";
import { Home, Building, Briefcase, FileText, FilePen, Mail, Settings, User, LogOut, ChevronDown, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "../../context/ToastContext";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [inquiriesOpen, setInquiriesOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [adminSettingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { showToast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    }
    // Toast: warning about future expiration (e.g. in 30 mins)
    const expirationTimer = setTimeout(() => {
      showToast("Your session will expire soon. Please save your work.", "warning");
    }, 1000 * 60 * 15); // 15 minutes (adjust to 30*60*1000 for 30 mins)

    const handleLogout = () => {
      localStorage.removeItem("jwt");
      router.push("/admin/login");
    };
    // Event from API interceptor
    const handleConfirmLogout = (e) => {
      setShowLogoutConfirm(true);
      showToast(e.detail || "Session expired. Please confirm logout.", "error");
    };

    window.addEventListener("confirmSessionLogout", handleConfirmLogout);

    return () => {
      clearTimeout(expirationTimer);
      window.removeEventListener("confirmSessionLogout", handleConfirmLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="h-full w-56 bg-[#990e15] text-white fixed top-0 left-0 shadow-lg flex flex-col justify-between">
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav>
            <ul className="space-y-4">
              <li><Link href="/admin/dashboard" className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded-md"><Home size={18} /> <span>Dashboard</span></Link></li>
              <li><Link href="/admin/properties" className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded-md"><Building size={18} /> <span>Properties</span></Link></li>
              <li><Link href="/admin/services" className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded-md"><Briefcase size={18} /> <span>Services</span></Link></li>
              <li><Link href="/admin/news" className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded-md"><FileText size={18} /> <span>News</span></Link></li>

              {/* Job Listings Dropdown */}
              <li>
                <button
                  onClick={() => setJobsOpen(!jobsOpen)}
                  className="flex items-center justify-between w-full p-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <FilePen size={18} />
                    <span>Job Listings</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${jobsOpen ? "rotate-180" : ""}`} />
                </button>
                {jobsOpen && (
                  <ul className="ml-5 space-y-2">
                    <li><Link href="/admin/jobs" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Job Listings</Link></li>
                    <li><Link href="/admin/job-applications" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Job Applicants</Link></li>
                    <li><Link href="/admin/appointment" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Appointments</Link></li>
                  </ul>
                )}
              </li>

              {/* Contact & Inquiries Dropdown */}
              <li>
                <button
                  onClick={() => setInquiriesOpen(!inquiriesOpen)}
                  className="flex items-center justify-between w-full p-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Mail size={18} />
                    <span>Inquiries</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${inquiriesOpen ? "rotate-180" : ""}`} />
                </button>
                {inquiriesOpen && (
                  <ul className="ml-5 space-y-2">
                    <li><Link href="/admin/inquiries" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">All Inquiries</Link></li>
                    <li><Link href="/admin/contacts" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Contacts</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setSettingsOpen(!adminSettingsOpen)}
                  className="flex items-center justify-between w-full p-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Settings size={18} />
                    <span>Settings</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${adminSettingsOpen ? "rotate-180" : ""}`} />
                </button>
                {adminSettingsOpen && (
                  <ul className="ml-5 space-y-2">
                    <li><Link href="/admin/about-us" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">About Us</Link></li>
                    <li><Link href="/auth/register" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Create Account</Link></li>
                    {/* <li><Link href="/admin/appointment" className="block px-3 py-2 bg-red-800 rounded-md hover:bg-red-700">Appointments</Link></li> */}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section - Fixed Alignment */}
        <div className="p-5">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition mb-4"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="ml-2">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <Link href="/admin/profile" className="flex items-center space-x-2 hover:bg-red-700 p-2 rounded-md mb-4">
            <User size={18} /> <span>Profile</span>
          </Link>

          {/* Dark Mode Toggle - Spaced Properly */}


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-left w-full hover:bg-red-700 p-2 rounded-md"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:ml-56 p-8 bg-gray-50 dark:bg-gray-800 dark:text-white transition-colors">
        {children}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-md shadow-lg w-full max-w-sm mx-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Session Expired</h2>
              <p className="text-sm text-gray-600 mb-5">
                Your session has expired. Please log in again to continue.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleLogout}
                  className="bg-[#990e15] text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
