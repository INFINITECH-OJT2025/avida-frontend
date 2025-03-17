import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Eye, Edit, Trash2, Plus, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

const JobTable = ({ onView, onEdit, onDelete, onAdd }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of jobs per page
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      });
  }, []);

  // Search functionality
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowercasedQuery) ||
        job.department.toLowerCase().includes(lowercasedQuery) ||
        job.job_type.toLowerCase().includes(lowercasedQuery) ||
        job.status.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchQuery, jobs]);

  // Handles dropdown toggling
  const handleDropdownClick = (event, job) => {
    event.stopPropagation();

    if (selectedJob && selectedJob.id === job.id) {
      setSelectedJob(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });

    setSelectedJob(job);
  };

  // Closes dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedJob(null);
      }
    };

    if (selectedJob) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedJob]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 relative w-full max-w-4xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Job Listings</h2>
        <button
          onClick={onAdd}
          className="bg-[#990e15] text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition"
        >
          <Plus size={18} className="mr-2" /> Add New Job
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-3 py-2">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none px-2 text-gray-700"
        />
      </div>

      {/* Job Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr className="bg-[#990e15] text-white">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Job Type</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job, index) => (
              <tr
                key={job.id}
                className={`border-b hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.department}</td>
                <td className="py-3 px-4">{job.job_type}</td>

                {/* Status Badge with Icons */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`flex items-center justify-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                      job.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {job.status === "Published" ? (
                      <>
                        <CheckCircle size={14} className="text-green-600" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-gray-600" />
                        Inactive
                      </>
                    )}
                  </span>
                </td>

                {/* Actions Button */}
                <td className="py-3 px-4 text-center relative">
                  <button
                    onClick={(event) => handleDropdownClick(event, job)}
                    className="flex items-center text-gray-700 hover:text-[#990e15] transition font-medium"
                  >
                    <span>Actions</span>
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* Portal Dropdown (Opens Outside Table) */}
      {selectedJob &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute bg-white shadow-lg border rounded-lg p-2 w-48 z-50 transition transform scale-100"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <button onClick={() => onView(selectedJob)} className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-100">
              <Eye size={16} className="mr-2 text-gray-600" /> View Details
            </button>
            <button onClick={() => onEdit(selectedJob)} className="w-full px-4 py-2 flex items-center text-sm hover:bg-gray-100">
              <Edit size={16} className="mr-2 text-gray-600" /> Edit Job
            </button>
            <hr className="border-gray-200 my-1" />
            <button onClick={() => onDelete(selectedJob.id)} className="w-full px-4 py-2 flex items-center text-sm text-red-600 hover:bg-red-100">
              <Trash2 size={16} className="mr-2" /> Delete Job
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default JobTable;
