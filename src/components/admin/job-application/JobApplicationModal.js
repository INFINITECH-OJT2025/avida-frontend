// src/components/admin/job-application/JobApplicationModal.js
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Textarea  from "@/components/ui/textarea"; // now it will work!
import { callAPI } from "../../../utils/api"; // ✅ Reusable API
import { useToast } from "../../../context/ToastContext"; // ✅ Toast context

export default function JobApplicationModal({ open, application, onClose }) {
  const [replyMessage, setReplyMessage] = useState("");
  const { showToast } = useToast();

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

  if (!application) return null;

  return (
<Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#990e15]">
            Job Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Full Name:</strong> {application.full_name}</p>
          <p><strong>Email:</strong> {application.email}</p>
          <p><strong>Phone:</strong> {application.phone_number}</p>
          <p><strong>Job Applied:</strong> {application.job?.title || "N/A"}</p>
          <p><strong>Status:</strong> {application.status}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Admin Reply</h3>
          <Textarea
            placeholder="Write your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 rounded-md"
          >
            Close
          </Button>
          <Button
            onClick={sendReply}
            className="bg-[#990e15] hover:bg-[#7d0d12] text-white px-6 py-2 rounded-md"
          >
            Send Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
