import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";

export default function NewsViewModal({ isOpen, onClose, newsItem }) {
  const [pageIndex, setPageIndex] = useState(0);

  if (!isOpen || !newsItem) return null;

  const charactersPerPage = 500;
  const contentPages = newsItem.content
    ? newsItem.content.match(new RegExp(`.{1,${charactersPerPage}}`, "g"))
    : [];

  const currentPage = contentPages[pageIndex] || "";

  const goNext = () => {
    if (pageIndex < contentPages.length - 1) setPageIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >
        {/* <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button> */}

        <div className="flex flex-col h-full">
          {/* Image Banner */}
          {Array.isArray(newsItem.images) && newsItem.images.length > 0 && (
            <div className="mb-4">
              <img
                src={newsItem.images[0]}
                alt="Banner"
                className="w-full h-56 object-cover rounded-xl border border-gray-300 shadow-md"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
            </div>
          )}

          {/* Header */}
          <DialogHeader className="pb-4 mb-4 border-b">
            <DialogTitle className="text-3xl font-extrabold text-[#990e15]">
              {newsItem.title}
            </DialogTitle>
            <div className="mt-2 space-y-1">
              {newsItem.category && (
                <p className="text-sm font-semibold text-gray-600">{newsItem.category}</p>
              )}
              {newsItem.created_at && (
                <p className="text-xs text-gray-400">
                  Posted on {newsItem.created_at.split("T")[0]}
                </p>
              )}
            </div>
          </DialogHeader>

          {/* Paginated Content */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="text-gray-800 whitespace-pre-line text-[15px] leading-relaxed border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-inner">
              {currentPage || "No content provided."}
            </div>
          </div>

          {/* Pagination Controls */}
          {contentPages.length > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t bg-white mt-4 rounded-b-xl">
              <button
                onClick={goPrev}
                disabled={pageIndex === 0}
                className={`px-5 py-2 rounded-md font-medium transition ${pageIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#990e15] text-white hover:bg-[#7d0b11]"}`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-600 font-medium">
                Page {pageIndex + 1} of {contentPages.length}
              </span>

              <button
                onClick={goNext}
                disabled={pageIndex === contentPages.length - 1}
                className={`px-5 py-2 rounded-md font-medium transition ${pageIndex === contentPages.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#990e15] text-white hover:bg-[#7d0b11]"}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
