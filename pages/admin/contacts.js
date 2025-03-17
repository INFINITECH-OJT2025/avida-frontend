import { useState, useEffect } from "react";
import { getContacts, updateContact, addContact, deleteContact } from "../../src/utils/api";
import { FaSave, FaEdit, FaTrash, FaEye, FaPlus, FaTimes } from "react-icons/fa";
import AdminLayout from "../../src/components/layout/AdminLayout";

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newContact, setNewContact] = useState({
        name: "", address: "", main_phone: "", sales_phone: "", leasing_phone: "",
        employment_phone: "", customer_care_phone: "", customer_care_landline: "",
        email: "", support_email: "", business_hours: "",
        facebook_link: "", instagram_link: "", youtube_link: "", linkedin_link: "", tiktok_link: ""
    });

    useEffect(() => { fetchContacts(); }, []);

    const fetchContacts = async () => {
        try {
            const response = await getContacts();
            setContacts(response);
        } catch (error) {
            setErrorMessage("Error fetching contacts. Please try again.");
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const addedContact = await addContact(newContact);
            setContacts([...contacts, addedContact]);
            setModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to add contact. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateContact(selectedContact.id, selectedContact);
            setContacts(contacts.map(contact => contact.id === selectedContact.id ? selectedContact : contact));
            setEditModalOpen(false);
        } catch (error) {
            setErrorMessage("Failed to update contact. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
<div className="container mx-auto p-4 flex justify-end">
                <div className="w-full max-w-7xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl font-bold text-[#990e15]">Manage Contacts</h2>
                        <button 
                            onClick={() => setModalOpen(true)} 
                            className="bg-[#990e15] text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-red-800 transition duration-300">
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
                                {contacts.map(contact => (
                                    <tr key={contact.email} className="border-t hover:bg-gray-100 transition duration-200">
                                        <td className="p-4">{contact.name}</td>
                                        <td className="p-4">{contact.email}</td>
                                        <td className="p-4">{contact.main_phone}</td>
                                        <td className="p-4 flex justify-center gap-3">
                                            <button onClick={() => { setSelectedContact(contact); setViewModalOpen(true); }} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition"><FaEye /></button>
                                            <button onClick={() => { setSelectedContact(contact); setEditModalOpen(true); }} className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-700 transition"><FaEdit /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                                <p className="text-sm font-bold">{key.replace(/_/g, " ").toUpperCase()}:</p>
                                                <p className="border p-2 rounded bg-gray-100">{value}</p>
                                            </div>
                                        )
                                    ))}
                                <button type="submit" className="col-span-full bg-[#990e15] text-white px-4 py-2 rounded-md">Update</button>
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
        </AdminLayout>
    );
}
