// src\components\admin\job\JobApplicationModal.js
import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Reusable API

const JobApplicationModal = ({ application, onClose }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const { showToast } = useToast(); // ✅ Correct usage

  const sendReply = async () => {
    if (!application || !application.id) {
      console.error("Error: Application ID is missing");
      showToast("Error: Application ID is missing.", "error");
      return;
    }

    try {
      await callAPI("post", `/admin/job-applications/${application.id}/reply`, {
        admin_reply: replyMessage,
      });

      showToast("Reply sent successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      showToast("Failed to send reply: " + error.message, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
            Close
          </button>
          <button onClick={sendReply} className="bg-[#990e15] text-white px-4 py-2 rounded-lg">
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
