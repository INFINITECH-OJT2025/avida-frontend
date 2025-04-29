// src/components/admin/news/NewsFormModal.js
import { Dialog } from "@/components/ui/dialog";
import NewsForm from "./create";

export default function NewsFormModal({ isOpen, onClose, selectedNews, fetchNews }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className=" rounded-xl  w-full max-w-6xl max-h-[95vh] overflow-auto p-8">
        <NewsForm
          selectedNews={selectedNews}
          closeModal={onClose}
          fetchNews={fetchNews}
        />
      </div>
    </div>
  );
}
