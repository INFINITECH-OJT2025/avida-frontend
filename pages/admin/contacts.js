import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SEOComponent from "@/hooks/useSEO";
import { useToast } from "@/context/ToastContext";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import {
  getAdminContacts,
  addContact,
  updateContact,
  deleteContact,
} from "@/utils/api";
import ContactsTable from "@/components/admin/contacts/ContactTable";
import ContactFormModal from "@/components/admin/contacts/ContactFormModal";
import ContactViewModal from "@/components/admin/contacts/ContactViewModal";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [viewContact, setViewContact] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showToast("Failed to load contacts.", "error");
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormModalOpen(true);
  };

  const handleEdit = (contact) => {
    setEditData(contact);
    setFormModalOpen(true);
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this contact?", async () => {
      try {
        await deleteContact(id);
        showToast("Contact deleted successfully!", "success");
        fetchContacts();
      } catch (error) {
        console.error("Delete contact failed:", error);
        showToast("Failed to delete contact.", "error");
      }
    });
  };

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="p-6 max-w-7xl mx-auto">
        <ContactsTable
          contacts={contacts}
          onDelete={handleDelete}
          onView={(contact) => setViewContact(contact)}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      </div>

      <ContactViewModal
        isOpen={!!viewContact}
        onClose={() => setViewContact(null)}
        contact={viewContact}
      />

      <ContactFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={editData}
        onSuccess={fetchContacts}
      />

      <ConfirmDialog />
    </AdminLayout>
  );
}
