import { Home, Building, Calculator, Briefcase, FileText, Mail, Settings, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="h-full w-64 min-w-[250px] bg-[#990e15] text-white fixed top-0 left-0 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav>
            <ul className="space-y-4">
              <li><Link href="/admin/dashboard" className="flex items-center space-x-2"><Home size={18} /> <span>Dashboard</span></Link></li>
              <li><Link href="/admin/properties" className="flex items-center space-x-2"><Building size={18} /> <span>Properties</span></Link></li>
              <li><Link href="/admin/loan-planner" className="flex items-center space-x-2"><Calculator size={18} /> <span>Loan & Room Planner</span></Link></li>
              <li><Link href="/admin/services" className="flex items-center space-x-2"><Briefcase size={18} /> <span>Services & Careers</span></Link></li>
              <li><Link href="/admin/news" className="flex items-center space-x-2"><FileText size={18} /> <span>News & Announcements</span></Link></li>
              <li><Link href="/admin/inquiries" className="flex items-center space-x-2"><Mail size={18} /> <span>Contact & Inquiries</span></Link></li>
              <li><Link href="/admin/settings" className="flex items-center space-x-2"><Settings size={18} /> <span>Admin Settings</span></Link></li>
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6">
            <Link href="/admin/profile" className="flex items-center space-x-2"><User size={18} /> <span>Profile</span></Link>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-left w-full mt-4">
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
