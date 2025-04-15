// pages/admin/properties.js
import { useEffect, useState } from "react";
import "lightbox2/dist/css/lightbox.min.css";
import AdminLayout from "@/components/layout/AdminLayout";
import Image from "next/image";
import SEOComponent from "@/hooks/useSEO";
import { useToast } from "@/context/ToastContext";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { getProperties, updatePropertyStatus, deletePropertyById } from "@/utils/api";
import PropertiesTable from "@/components/admin/properties/PropertiesTable";
import PropertyViewer from "@/components/admin/properties/PropertyViewer";
import PropertyFormModal from "@/components/admin/properties/PropertyFormModal";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  const [viewProperty, setViewProperty] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      showToast("Failed to load properties.", "error");
    }
  };

  // Open for Add
const handleAdd = () => {
  setEditData(null);
  setFormModalOpen(true);
};

// Open for Edit
const handleEdit = (property) => {
  setEditData(property);
  setFormModalOpen(true);
};

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updatePropertyStatus(id, newStatus);
      showToast("Property status updated!", "success");
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error);
      showToast("Failed to update status.", "error");
    }
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this property?", async () => {
      try {
        await deletePropertyById(id);
        showToast("Property deleted!", "success");
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        showToast("Failed to delete property.", "error");
      }
    });
  };

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="p-6 max-w-7xl mx-auto">

      <PropertiesTable
  properties={properties}
  onUpdateStatus={handleUpdateStatus}
  onDelete={handleDelete}
  onView={(property) => setViewProperty(property)}
  onEdit={handleEdit}
  onAdd={handleAdd}
/>

      </div>
        <PropertyViewer
  property={viewProperty}
  onClose={() => setViewProperty(null)}
/>
<PropertyFormModal
  isOpen={formModalOpen}
  onClose={() => setFormModalOpen(false)}
  initialData={editData}
  onSuccess={fetchProperties}
/>

      <ConfirmDialog />    

    </AdminLayout>
  );
}
