import { useState, useEffect } from "react";
import {
  getAdminContacts,
  updateContact,
  addContact,
  deleteContact,
} from "../../src/utils/api";
import {
  FaSave,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { useToast } from "../../src/context/ToastContext";
import useConfirmDialog from "../../src/hooks/useConfirmDialog";
import SEOComponent from "../../src/hooks/useSEO";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  const [newContact, setNewContact] = useState({
    name: "",
    address: "",
    main_phone: "",
    sales_phone: "",
    leasing_phone: "",
    employment_phone: "",
    customer_care_phone: "",
    customer_care_landline: "",
    email: "",
    support_email: "",
    business_hours: "",
    facebook_link: "",
    instagram_link: "",
    youtube_link: "",
    linkedin_link: "",
    tiktok_link: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const { showToast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (error) {
      showToast("Error fetching contacts. Please try again.", "error");
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const addedContact = await addContact(newContact);
      setContacts([...contacts, addedContact]);
      setModalOpen(false);
      showToast("Contact added successfully!", "success");
    } catch (error) {
      showToast("Failed to add contact. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContact(selectedContact.id, selectedContact);
      setContacts(
        contacts.map((contact) =>
          contact.id === selectedContact.id ? selectedContact : contact
        )
      );
      setEditModalOpen(false);
      showToast("Contact updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update contact. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this contact?", async () => {
      try {
        await deleteContact(id);
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        showToast("Contact deleted successfully.", "success");
      } catch (error) {
        showToast("Failed to delete contact.", "error");
      }
    });
  };

  const totalPages = Math.ceil(contacts.length / rowsPerPage);
  const currentRows = contacts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout><SEOComponent />
      <div className="container mx-auto p-4 flex justify-end">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-[#990e15]">Manage Contacts</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#990e15] text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-red-800 transition duration-300"
            >
              <FaPlus /> Add Contact
            </button>
          </div>

          <div className="overflow-hidden border border-gray-300 shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-[#990e15] text-white">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map(contact => (
                  <tr key={contact.email} className="border-t hover:bg-gray-100 transition duration-200">
                    <td className="p-4">{contact.name}</td>
                    <td className="p-4">{contact.email}</td>
                    <td className="p-4">{contact.main_phone}</td>
                    <td className="p-4 flex justify-center gap-3">
  <button onClick={() => { setSelectedContact(contact); setViewModalOpen(true); }} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition"><FaEye /></button>
  <button onClick={() => { setSelectedContact(contact); setEditModalOpen(true); }} className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700 transition"><FaEdit /></button>
  <button onClick={() => handleDelete(contact.id)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-800 transition"><FaTrash /></button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-6">
              <button
                className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>

          {/* Add Contact Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#990e15]">Add Contact</h3>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-black"><FaTimes /></button>
                </div>
                <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(newContact).map((key) => (
                    <div key={key}>
                      <label className="text-sm font-bold">{key.replace(/_/g, " ").toUpperCase()}</label>
                      <input type="text" value={newContact[key]} onChange={(e) => setNewContact({ ...newContact, [key]: e.target.value })} className="border p-2 rounded w-full" required />
                    </div>
                  ))}
                  <button type="submit" className="col-span-full bg-[#990e15] text-white px-4 py-2 rounded-md">Save</button>
                </form>
              </div>
            </div>
          )}

          {/* Edit Contact Modal */}
          {editModalOpen && selectedContact && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#990e15]">Edit Contact</h3>
                  <button onClick={() => setEditModalOpen(false)} className="text-gray-600 hover:text-black"><FaTimes /></button>
                </div>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedContact).map(([key, value]) => (
                    key !== "id" && (
                      <div key={key}>
                        <label className="text-sm font-bold">{key.replace(/_/g, " ").toUpperCase()}</label>
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) => setSelectedContact({ ...selectedContact, [key]: e.target.value })}
                          className="border p-2 rounded w-full focus:ring-2 focus:ring-[#990e15]"
                        />
                      </div>
                    )
                  ))}
                  <button type="submit" className="col-span-full bg-[#990e15] text-white px-4 py-2 rounded-md hover:bg-red-800">
                    Update
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* View Contact Modal */}
          {viewModalOpen && selectedContact && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#990e15]">Contact Details</h3>
                  <button onClick={() => setViewModalOpen(false)} className="text-gray-600 hover:text-black"><FaTimes /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedContact).map(([key, value]) => (
                    key !== "id" && (
                      <div key={key}>
                        <p className="text-sm font-bold">{key.replace(/_/g, " ").toUpperCase()}:</p>
                        <p className="border p-2 rounded bg-gray-100">{value}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      {ConfirmDialog()}
    </AdminLayout>
  );
}
