import { useState, useEffect } from "react";

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null); // Stores inquiry for "View"
    const [replyInquiry, setReplyInquiry] = useState(null); // Stores inquiry for "Reply"
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [replyMessage, setReplyMessage] = useState("");

    // ✅ Fetch all inquiries
    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/inquiries");
            const data = await response.json();
            setInquiries(data);
        } catch (error) {
            setError("Failed to load inquiries.");
        }
    };

    // ✅ Open "View Inquiry" Modal
    const viewInquiry = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inquiries/${id}/with-replies`);
            if (!response.ok) throw new Error("Failed to fetch inquiry details");
            const data = await response.json();
            setSelectedInquiry({ ...data, replies: data.replies || [] });
            setReplyInquiry(null); // 🚀 Make sure Reply section does NOT open
        } catch (error) {
            console.error("Error fetching inquiry:", error);
            setError("Failed to load inquiry details.");
        }
    };

    // ✅ Open "Reply to Inquiry" Section
    const openReplySection = (inquiry) => {
        setReplyInquiry(inquiry);
        setSelectedInquiry(null);
    };

    // ✅ Send Reply
    const sendReply = async () => {
        if (!replyInquiry?.id || !replyMessage.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inquiries/${replyInquiry.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyMessage }),
            });

            if (response.ok) {
                setReplyMessage("");
                openReplySection(replyInquiry); // Refresh replies
            } else {
                setError("Failed to send reply.");
            }
        } catch (error) {
            setError("Error sending reply.");
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4 text-[#990e15]">Admin - Inquiries</h1>
            {error && <p className="text-red-600">{error}</p>}

            {/* ✅ Inquiry List */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3 text-[#990e15]">All Inquiries</h2>
                <ul>
                    {inquiries.map((inquiry) => (
                        <li key={inquiry.id} className="border-b py-2 flex justify-between">
                            <span className="text-gray-700">Mr./Ms. {inquiry.last_name}, {inquiry.first_name} || {inquiry.inquiry_type} || {inquiry.status}</span>
                            <div>
                                <button className="text-[#990e15] font-semibold hover:underline mr-2" onClick={() => viewInquiry(inquiry.id)}>View</button>
                                <button className="text-green-600 font-semibold hover:underline mr-2" onClick={() => openReplySection(inquiry)}>Reply</button>
                                <button className="text-red-600 font-semibold hover:underline" onClick={() => console.log("Delete inquiry")}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ✅ Inquiry Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-[#990e15] mb-2">Inquiry Details</h2>
                        <p><strong>Name:</strong> {selectedInquiry.first_name} {selectedInquiry.last_name}</p>
                        <p><strong>Email:</strong> {selectedInquiry.email}</p>
                        <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
                        <p><strong>Message:</strong> {selectedInquiry.message}</p>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded mt-4" onClick={() => setSelectedInquiry(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* ✅ Reply Section (Separate from View Modal) */}
            {replyInquiry && (
                <div className="mt-4 bg-white p-4 shadow-lg rounded-lg border-l-4 border-[#990e15]">
                    <h3 className="text-lg font-semibold text-[#990e15]">Reply to Inquiry</h3>

                    {/* ✅ Conversation History */}
                    <div className="border p-3 rounded-lg mt-2 bg-gray-50">
                        {replyInquiry.replies?.length > 0 ? (
                            replyInquiry.replies.map((reply, index) => (
                                <div key={index} className={`p-3 my-2 rounded-lg shadow ${reply.sender === 'Admin' ? 'bg-[#990e15] text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    <strong>{reply.sender}:</strong>
                                    <p>{reply.message}</p>
                                    <p className="text-xs text-gray-300">{new Date(reply.created_at).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No replies yet.</p>
                        )}
                    </div>

                    {/* ✅ Reply Input */}
                    <textarea
                        className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-[#990e15]"
                        rows="3"
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>

                    {/* ✅ Send Reply Button */}
                    <button
                        className="bg-[#990e15] text-white px-4 py-2 mt-2 rounded hover:bg-red-800"
                        onClick={sendReply}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reply"}
                    </button>

                    <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2" onClick={() => setReplyInquiry(null)}>
                        Close Reply
                    </button>
                </div>
            )}
        </div>
    );
}
