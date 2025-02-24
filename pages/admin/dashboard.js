Dashboard.useAdminLayout = true; 
import DashboardStats from "@/components/admin/DashboardStats";
import ProfileDropdown from "@/components/admin/ProfileDropdown";
import { Moon, Bell, Home, Mail } from "lucide-react";

export default function Dashboard() {
    <header className="header">
  <input
    type="text"
    placeholder="Search..."
    className="w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
  />
  <div className="flex items-center space-x-4">
    <button><Moon size={20} /></button>
    <button className="relative">
      <Bell size={20} />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
    </button>
    <ProfileDropdown />
  </div>
</header>

    return (
        
        <div className="flex">
          <div className="flex-1 ml-24 mr-24">
            <main className="p-6 bg-gray-100 min-h-screen">
              {/* <DashboardStats /> */}
            </main>
          </div>
        </div>
      );
}
