import { useState, useEffect } from "react";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { getInquiries, getInquiryWithReplies, replyToInquiry, updateInquiryStatus} from "../../src/utils/api";
import { useToast } from "../../src/context/ToastContext";
import SEOComponent from "../../src/hooks/useSEO";
export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyInquiry, setReplyInquiry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const { showToast } = useToast();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await getInquiries();
            setInquiries(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const viewInquiry = async (id) => {
        try {
            const data = await getInquiryWithReplies(id);
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
            await replyToInquiry(replyInquiry.id, { message: replyMessage });
            setReplyMessage("");
            fetchInquiries();
            showToast("Reply sent successfully!", "success");
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await updateInquiryStatus(id, newStatus);
            fetchInquiries();
        } catch (error) {
            setError(error.message);
        }
    };

    const totalPages = Math.ceil(inquiries.length / rowsPerPage);
    const currentRows = inquiries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <AdminLayout><SEOComponent />
            <div className="p-6 ml-[270px]">
                <h1 className="text-2xl font-bold mb-6 text-[#990e15]">Admin - Inquiries</h1>
                {error && <p className="text-red-600">{error}</p>}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#990e15] text-white text-left">
                                <th className="p-3 w-[20%] text-center">Name</th>
                                <th className="p-3 w-[10%] text-center">Type</th>
                                <th className="p-3 w-[10%] text-center">Status</th>
                                <th className="p-3 w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((inquiry) => (
                                <tr key={inquiry.id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-3 text-center">{inquiry.first_name} {inquiry.last_name}</td>
                                    <td className="p-3 text-gray-600 text-center">{inquiry.inquiry_type}</td>
                                    <td className="p-3 text-center">
                                        <select
                                            className="px-3 py-1 rounded text-xs border bg-gray-100 w-[90%] text-center"
                                            value={inquiry.status}
                                            onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="on_process">Processing</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-center w-[10%]">
                                        <select
                                            className="px-2 py-1 rounded text-xs border bg-gray-100 w-[90%]"
                                            onChange={(e) => {
                                                if (e.target.value === "view") viewInquiry(inquiry.id);
                                                if (e.target.value === "reply") openReplyModal(inquiry);
                                                if (e.target.value === "done") updateStatus(inquiry.id, "done");
                                            }}
                                        >
                                            <option value="" hidden>Choose Action</option>
                                            <option value="view">View</option>
                                            <option value="reply">Reply</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
