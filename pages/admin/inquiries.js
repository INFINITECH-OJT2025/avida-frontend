import { useState, useEffect } from "react";
import AdminLayout from "../../src/components/layout/AdminLayout";

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyInquiry, setReplyInquiry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [replyMessage, setReplyMessage] = useState("");

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/inquiries");
            if (!response.ok) throw new Error("Failed to load inquiries.");
            const data = await response.json();
            setInquiries(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const viewInquiry = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inquiries/${id}/with-replies`);
            if (!response.ok) throw new Error("Failed to fetch inquiry details");
            const data = await response.json();
            setSelectedInquiry(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const openReplyModal = (inquiry) => {
        setReplyInquiry(inquiry);
        setReplyMessage("");
    };

    const sendReply = async () => {
        if (!replyInquiry?.id || !replyMessage.trim()) {
            setError("Reply message cannot be empty!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inquiries/${replyInquiry.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyMessage }),
            });
            if (!response.ok) throw new Error("Failed to send reply.");
            setReplyMessage("");
            fetchInquiries();
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/inquiries/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error("Failed to update status.");
            fetchInquiries();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 ml-[270px]">
                <h1 className="text-2xl font-bold mb-6 text-[#990e15]">Admin - Inquiries</h1>
                {error && <p className="text-red-600">{error}</p>}

                {/* ✅ Inquiry Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#990e15] text-white text-sm">
                                <th className="p-2">Name</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="border-b">
                                    <td className="p-2">{inquiry.first_name} {inquiry.last_name}</td>
                                    <td className="p-2 text-gray-600">{inquiry.inquiry_type}</td>
                                    
                                    {/* ✅ Status Dropdown */}
                                    <td className="p-2">
                                        <select
                                            className="px-2 py-1 rounded text-xs border bg-gray-100"
                                            value={inquiry.status}
                                            onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="on_process">Processing</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </td>

                                    {/* ✅ Action Dropdown */}
                                    <td className="p-2">
                                        <select
                                            className="px-2 py-1 rounded text-xs border bg-gray-100"
                                            onChange={(e) => {
                                                if (e.target.value === "view") viewInquiry(inquiry.id);
                                                if (e.target.value === "reply") openReplyModal(inquiry);
                                                if (e.target.value === "done") updateStatus(inquiry.id, "done");
                                            }}
                                        >
                                            <option value="" hidden>Choose Action</option>
                                            <option value="view">View Inquiry</option>
                                            <option value="reply">Reply</option>
                                            <option value="done">Mark as Done</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Inquiry Details Modal */}
                {selectedInquiry && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-[320px]">
                            <h2 className="text-lg font-semibold text-[#990e15] mb-2">Inquiry Details</h2>
                            <p><strong>Name:</strong> {selectedInquiry.first_name} {selectedInquiry.last_name}</p>
                            <p><strong>Email:</strong> {selectedInquiry.email}</p>
                            <p><strong>Message:</strong> {selectedInquiry.message}</p>
                            <button className="mt-3 bg-[#990e15] text-white px-3 py-1 rounded text-sm hover:bg-red-800" onClick={() => setSelectedInquiry(null)}>Close</button>
                        </div>
                    </div>
                )}

                {/* ✅ Reply Modal */}
                {replyInquiry && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-[320px]">
                            <h3 className="text-md font-semibold text-[#990e15]">Reply to Inquiry</h3>
                            <textarea className="w-full p-2 border rounded mt-2 text-xs focus:ring-2 focus:ring-[#990e15]" rows="3" placeholder="Type your reply..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)}></textarea>
                            <button className="mt-2 bg-[#990e15] text-white px-3 py-1 text-xs rounded hover:bg-red-800" onClick={sendReply} disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </button>
                            <button className="mt-2 bg-gray-500 text-white px-3 py-1 text-xs rounded ml-2" onClick={() => setReplyInquiry(null)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
