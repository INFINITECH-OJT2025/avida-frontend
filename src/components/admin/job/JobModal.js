import { useEffect, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const JobModal = ({ job, onClose }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  // Format salary in PHP currency
  const formatPeso = (amount) => {
    return amount ? `₱${parseFloat(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "N/A";
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div ref={modalRef} className="bg-white p-5 rounded-xl shadow-lg w-full max-w-2xl relative border">
        
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-6 right-3 text-gray-900 hover:text-red-500 text-6xl"
        >
          &times;
        </button> */}

        {/* Job Image (Click to Open in Lightbox) */}
        {job.image && (
          <>
            <img
              src={`/storage/${job.image}`}
              alt={job.title}
              className="w-full h-32 object-cover mb-3 rounded-lg cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />
            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={[{ src: `/storage/${job.image}` }]} />
          </>
        )}

        {/* Job Title & Status */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-[#990e15]">{job.title}</h2>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-lg ${
              job.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Job Details */}
        <div className="space-y-1 text-xs text-gray-700">
          <p><strong>📌 Department:</strong> {job.department}</p>
          <p><strong>📄 Job Type:</strong> {job.job_type}</p>
          <p><strong>💰 Salary Range:</strong> {formatPeso(job.salary_min)} - {formatPeso(job.salary_max)}</p>
          <p><strong>📅 Deadline:</strong> {job.application_deadline}</p>
        </div>

        {/* Job Sections */}
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">📝 Job Description</h3>
            <div className="border p-2 bg-gray-100 rounded-lg text-xs leading-normal" dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">🛠 Responsibilities</h3>
            <div className="border p-2 bg-gray-100 rounded-lg text-xs leading-normal" dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">🎓 Qualifications</h3>
            <div className="border p-2 bg-gray-100 rounded-lg text-xs leading-normal" dangerouslySetInnerHTML={{ __html: job.qualifications }} />
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-xs transition" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
