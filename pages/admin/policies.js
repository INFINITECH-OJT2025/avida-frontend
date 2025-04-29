// pages/admin/policies.js
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEOComponent from "@/hooks/useSEO";
import { useToast } from "@/context/ToastContext";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import {
  getPolicies,
  deletePolicy,
} from "@/utils/api";
import PoliciesTable from "@/components/admin/policies/PoliciesTable";
import PolicyViewer from "@/components/admin/policies/PolicyViewer";
import PolicyFormModal from "@/components/admin/policies/PolicyFormModal";

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [viewPolicy, setViewPolicy] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      showToast("Unable to load policies.", "error");
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormModalOpen(true);
  };

  const handleEdit = (policy) => {
    setEditData(policy);
    setFormModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this policy?", async () => {
      try {
        await deletePolicy(id);
        showToast("Policy deleted successfully.", "success");
        fetchPolicies();
      } catch (err) {
        console.error(err);
        showToast("Failed to delete policy.", "error");
      }
    });
  };

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="p-6 max-w-7xl mx-auto">
        <PoliciesTable
          policies={policies}
          onView={(policy) => setViewPolicy(policy)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>

      <PolicyViewer
        policy={viewPolicy}
        onClose={() => setViewPolicy(null)}
      />

      <PolicyFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={editData}
        onSuccess={fetchPolicies}
      />

      <ConfirmDialog />
    </AdminLayout>
  );
}
