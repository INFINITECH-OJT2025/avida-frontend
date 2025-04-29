// pages/admin/appointments.js
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminLayout from "@/components/layout/AdminLayout";
import SEOComponent from "@/hooks/useSEO";
import { useToast } from "@/context/ToastContext";
import AppointmentTable from "@/components/admin/appointments/AppointmentTable";

export default function AdminAppointments() {
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminEmail(decoded.email);
    }
  }, []);

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="p-6 max-w-7xl mx-auto">
        <AppointmentTable adminEmail={adminEmail} />
      </div>
    </AdminLayout>
  );
}
