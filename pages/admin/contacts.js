import { useState, useEffect } from "react";
import { getContacts, updateContact, addContact } from "../../utils/api";

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await getContacts();
            setContacts(response);
        } catch (error) {
            setErrorMessage("Error fetching contacts. Please try again.");
            console.error("Fetch Contacts Error:", error);
        }
    };

    const handleUpdate = async (id, field, value) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await updateContact(id, { [field]: value });
            setContacts(contacts.map(contact =>
                contact.id === id ? { ...contact, [field]: value } : contact
            ));
            setSuccessMessage("✅ Contact updated successfully!");
        } catch (error) {
            setErrorMessage("❌ Failed to update contact. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const addedContact = await addContact(newContact);
            setContacts([...contacts, addedContact]);
            setSuccessMessage("✅ New contact added successfully!");
            setNewContact({
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
        } catch (error) {
            setErrorMessage("❌ Failed to add contact. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-[#990e15]">Admin - Manage Contacts</h2>

            {/* Success / Error Messages */}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            {/* 🆕 Add New Contact Form */}
            <div className="bg-white p-6 shadow-md rounded-lg mt-6">
                <h3 className="text-2xl font-semibold text-gray-700">Add New Contact</h3>
                <form onSubmit={handleAddContact} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(newContact).map((key) => (
                        <input
                            key={key}
                            type={key.includes("email") ? "email" : "text"}
                            placeholder={key.replace("_", " ").toUpperCase()}
                            value={newContact[key]}
                            onChange={(e) => setNewContact({ ...newContact, [key]: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    ))}
                    <button type="submit" className="col-span-full bg-[#990e15] text-white py-2 rounded-md font-bold hover:bg-red-800">
                        {loading ? "Saving..." : "Add Contact"}
                    </button>
                </form>
            </div>

            {/* 🔄 Edit Existing Contacts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map(contact => (
                    <div key={contact.id} className="p-6 border rounded-lg shadow-md bg-white">
                        <h3 className="text-xl font-bold">{contact.name}</h3>

                        <div className="mt-4 space-y-3">
                            {Object.keys(contact).map((key) =>
                                key !== "id" && (
                                    <div key={key}>
                                        <label className="block text-gray-700 font-semibold">{key.replace("_", " ").toUpperCase()}</label>
                                        <input
                                            type={key.includes("email") ? "email" : "text"}
                                            value={contact[key] || ""}
                                            onChange={(e) => handleUpdate(contact.id, key, e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading Indicator */}
            {loading && <p className="text-blue-600 mt-4">Updating contact...</p>}
        </div>
    );
}
