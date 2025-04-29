// src\components\admin\job\JobApplicationsTable.js
import { useEffect, useState, useRef } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { FaTrash, FaEnvelope, FaFilePdf } from "react-icons/fa";
import { useToast } from "../../../context/ToastContext";
import { Document, Page, pdfjs } from "react-pdf";
import ResumeViewer from "../../admin/ResumeViewer";
import { callAPI } from "../../../utils/api"; // ✅ Reusable API handler
import { toast } from "react-toastify"; // ⬅️ only for JSX-based confirmation

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const JobApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
 
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const { showToast } = useToast();
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownApp, setDropdownApp] = useState(null);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
     
    callAPI("get", "/admin/job-applications")
      .then((data) => {
        setApplications(data);
 
      })
      .catch(() => {
        showToast("Failed to load applications");
 
      });
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownApp(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await callAPI("patch", `/admin/job-applications/${id}/status`, { status });
      setApplications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast("Status updated successfully!");
    } catch (err) {
      showToast("Failed to update status.");
    }
  };

  const deleteApplication = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="p-4 text-sm">
          <p className="text-gray-800 mb-3 font-semibold">
            Are you sure you want to delete this application?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              onClick={() => {
                confirmDelete(id);
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        hideProgressBar: true,
        pauseOnHover: true,
      }
    );
  };
  const confirmDelete = async (id) => {
    try {
      await callAPI("delete", `/admin/job-applications/${id}`);
      setApplications(applications.filter((a) => a.id !== id));
      showToast("Application deleted successfully!");
    } catch (err) {
      const message =
        err?.response?.data?.info ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete application.";
        showToast(message);
    }
  };
  
  const filteredApplications = applications.filter((app) =>
    [app.full_name, app.email, app.job?.title].some(
      (field) => field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const currentRows = filteredApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-full ml-auto py-12 px-10 relative">
      {(
        <>
          <h1 className="text-3xl font-bold text-[#990e15] mb-6">Job Applications</h1>

          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="🔍 Search by name, email, or job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-[#990e15]"
            />
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#990e15] text-white">
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Job</th>
                  <th className="p-3 text-left">Resume</th>
                  <th className="p-3 text-left">Status</th>
                  {/* <th className="p-3 text-left">Admin Reply</th> */}
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-100 relative">
                    <td className="p-3">{app.full_name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.phone_number}</td>
                    <td className="p-3">{app.job?.title || "N/A"}</td>
                    <td className="p-3 text-center">
                      {app.resume ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:underline flex items-center gap-2"
                        >
                          <FaFilePdf /> View Resume
                        </a>
                      ) : (
                        <span>No Resume</span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="border rounded-md p-1 focus:ring focus:ring-[#990e15]"
                      >
                        {["Pending", "Reviewed", "Shortlisted", "Rejected"].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* <td className="p-3">
  {app.admin_reply ? `${app.admin_reply.substring(0, 20)}...` : "No reply yet"}
</td> */}

                    <td className="p-3 text-center relative">
                      <button
                        className="px-3 py-2 border rounded-md hover:bg-gray-100 transition flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDropdownApp(app);
                          setDropdownPosition({
                            top: rect.bottom + window.scrollY + 5,
                            left: rect.left + window.scrollX,
                          });
                        }}
                        
                      >
                        Actions ▼
                      </button>

                      

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 px-6">
              <button
                className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                }`}
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                Previous
              </button>

              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </button>{dropdownApp && (
  <div
    ref={dropdownRef}
    className="fixed z-50 w-48 bg-white border shadow-md rounded-md"
    style={{
      top: dropdownPosition.top,
      left: dropdownPosition.left,
    }}
  >
    <button
      onClick={() => {
        setSelectedApplication(dropdownApp);
        setDropdownApp(null);
      }}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
    >
      <FaEnvelope /> Send Message
    </button>
    <button
      onClick={() => {
        deleteApplication(dropdownApp.id);
        setDropdownApp(null);
      }}
      className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
    >
      <FaTrash /> Delete
    </button>
  </div>
)}
            </div>
          </div>
{selectedApplication && (
  <JobApplicationModal
    application={selectedApplication}
    onClose={() => setSelectedApplication(null)}
  />
)}


        </>
      )}
    </div>
  );
};

export default JobApplicationsTable;
