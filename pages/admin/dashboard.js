import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../src/utils/api";
import KPICard from "../../src/components/admin/cards/KPICard";
import PropertyChart from "../../src/components/admin/charts/PropertyChart";
import InquiryChart from "../../src/components/admin/charts/InquiryChart";
import JobApplicationChart from "../../src/components/admin/charts/JobApplicationChart";
import WebsiteTrafficChart from "../../src/components/admin/charts/WebsiteTrafficChart";
import { FaHome, FaEnvelope, FaUsers, FaChartLine } from "react-icons/fa";
import AdminLayout from "../../src/components/layout/AdminLayout";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardStats().then(setStats);
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 ml-64">
        {/* Ensure sidebar does not block content */}
        <h1 className="text-2xl font-bold text-[#990e15]">Admin Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <KPICard title="Total Properties" value={stats.total_properties || 0} icon={<FaHome />} color="#990e15" />
          <KPICard title="Total Inquiries" value={stats.total_inquiries || 0} icon={<FaEnvelope />} color="#b3241c" />
          <KPICard title="Total Applications" value={stats.total_applications || 0} icon={<FaUsers />} color="#cc4b47" />
          <KPICard title="Total Appointments" value={stats.total_appointments || 0} icon={<FaChartLine />} color="#e06663" />
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PropertyChart />
          <InquiryChart />
          <JobApplicationChart />
          <WebsiteTrafficChart />
        </div>
      </div>
    </AdminLayout>
  );
}