// pages/admin/services.js

import { useEffect, useState } from "react";
import ServiceList from "../../src/components/admin/services/ServiceList";
import ServiceFormModal from "../../src/components/admin/services/ServiceForm";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { useToast } from "../../src/context/ToastContext";
import { getAllServices } from "../../src/utils/api";
import useConfirmDialog from "../../src/hooks/useConfirmDialog";
import SEOComponent from "../../src/hooks/useSEO";

export default function Services() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const fetchServices = async () => {
    try {
       
      const data = await getAllServices(); // ✅ updated
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      showToast(`Failed to fetch services: ${error.message}`, "error");
    } finally {
       
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(services.length / itemsPerPage));

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="flex justify-end pl-40">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-primary">Manage Services</h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#990e15] text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Add New
            </button>
          </div>

          <ServiceList
            services={paginatedServices}
            setEditingService={setEditingService}
            refreshServices={fetchServices}
            showConfirm={showConfirm} // Pass confirmation
            showToast={showToast} // Pass toast
          />

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <ServiceFormModal
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            editingService={editingService}
            setEditingService={setEditingService}
            refreshServices={fetchServices}
          />
        </div>
        <ConfirmDialog />
      </div>
    </AdminLayout>
  );
}
