import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X } from "lucide-react";

// ✅ Correct PDF.js worker version
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs-dist/build/pdf.worker.min.mjs";

export default function ResumeViewer({ resumeUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          ❌
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-4">Resume Preview</h2>

        {/* PDF Viewer */}
        <div className="border p-2">
          <Document 
            file={`${process.env.NEXT_PUBLIC_API_URL}/storage/resumes/${resumeUrl}`} 
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => setPageNumber(pageNumber - 1)} 
            disabled={pageNumber <= 1}
            className="bg-gray-500 text-white px-3 py-1 rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          <p>Page {pageNumber} of {numPages}</p>

          <button 
            onClick={() => setPageNumber(pageNumber + 1)} 
            disabled={pageNumber >= numPages}
            className="bg-gray-500 text-white px-3 py-1 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
