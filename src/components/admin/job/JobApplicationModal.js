// src\components\admin\job\JobApplicationModal.js
import { useState } from "react"; // ✅ Import useState

const JobApplicationModal = ({ application, onClose }) => {
  const [replyMessage, setReplyMessage] = useState("");

  const sendReply = async () => {
    if (!application || !application.id) {
      console.error("Error: Application ID is missing");
      alert("Error: Application ID is missing.");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/job-applications/${application.id}/reply`, {
        method: "POST", // ✅ Ensure this is POST
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" // Ensures Laravel returns JSON
        },
        body: JSON.stringify({ 
          admin_reply: replyMessage 
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reply");
      }
  
      alert("Reply sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply: " + error.message);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-[#990e15]">Job Application Details</h2>
        <p><strong>Name:</strong> {application.full_name}</p>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Phone:</strong> {application.phone_number}</p>
        <p><strong>Job:</strong> {application.job?.title || "N/A"}</p>
        <p><strong>Status:</strong> {application.status}</p>

        <h3 className="text-lg font-semibold mt-4">Admin Reply</h3>
        <textarea
          className="border p-2 w-full rounded-md"
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          rows="3"
        />

        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
          <button onClick={sendReply} className="bg-[#990e15] text-white px-4 py-2 rounded-lg">Send Reply</button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
