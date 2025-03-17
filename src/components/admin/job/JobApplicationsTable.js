import { useEffect, useState } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { FaTrash, FaEnvelope } from "react-icons/fa";

const JobApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/job-applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load applications");
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/job-applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setApplications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
      alert("Status updated successfully!");
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/job-applications/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();

      setApplications(applications.filter((a) => a.id !== id));
      alert("Application deleted successfully!");
    } catch (err) {
      alert("Failed to delete application.");
    }
  };

  const filteredApplications = applications.filter((app) =>
    [app.full_name, app.email, app.job?.title].some(
      (field) => field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const currentRows = filteredApplications.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleCloseModal = () => setSelectedApplication(null);

  return (
    <div className="max-w-full ml-auto py-12 px-10 relative">
      <h1 className="text-3xl font-bold text-[#990e15] mb-6">Job Applications</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or job title"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-[#990e15]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full w-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#990e15] text-white">
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Job</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Admin Reply</th>
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
                <td className="p-3">{app.admin_reply || "No reply yet"}</td>
                <td className="p-3 text-center relative">
                  {/* Actions Dropdown */}
                  <button
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 transition flex items-center"
                    onClick={() => setDropdownOpenId(dropdownOpenId === app.id ? null : app.id)}
                  >
                    Actions ▼
                  </button>

                  {/* Dropdown Menu (Appears Outside the Table) */}
                  {dropdownOpenId === app.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-50">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {currentRows.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      {selectedApplication && <JobApplicationModal application={selectedApplication} onClose={handleCloseModal} />}
    </div>
  );
};

export default JobApplicationsTable;
