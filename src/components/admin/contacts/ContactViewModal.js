// src/components/admin/contacts/ContactViewModal.js
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ContactViewModal({ isOpen, onClose, contact }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#990e15] text-xl font-bold">
            Contact Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {Object.entries(contact || {}).map(([key, value]) => (
            key !== "id" && (
              <div key={key}>
                <p className="text-sm font-bold">{key.replace(/_/g, " ").toUpperCase()}:</p>
                <p className="border p-3 rounded bg-gray-100 break-words whitespace-pre-wrap min-w-[150px]">
                  {value}
                </p>
              </div>
            )
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
