import { useState } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/router";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center space-x-2">
        <User size={24} />
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push("/admin/profile")}>
              <User size={16} className="inline-block mr-2" /> Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push("/admin/settings")}>
              <Settings size={16} className="inline-block mr-2" /> Settings
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={handleLogout}>
              <LogOut size={16} className="inline-block mr-2" /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
