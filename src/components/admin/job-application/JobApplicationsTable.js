import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api";
import TablePagination from "../../shared/TablePagination";
import { FaTrash, FaEnvelope, FaFilePdf } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import ResumeViewer from "./ResumeViewer";
import { toast } from "react-toastify";
import JobApplicationModal from "../job-application/JobApplicationModal";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const JobApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownApp, setDropdownApp] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const dropdownRef = useRef(null);
  const { showToast } = useToast();

  const rowsPerPage = 5;

  useEffect(() => {
    callAPI("get", "/admin/job-applications")
      .then((data) => {
        setApplications(data);
      })
      .catch(() => {
        showToast("Failed to load applications", "error");
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
      showToast("Status updated successfully!", "success");
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  const deleteApplication = (id) => {
    toast(({ closeToast }) => (
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
    ), { position: "top-center", autoClose: false, closeButton: false });
  };

  const confirmDelete = async (id) => {
    try {
      await callAPI("delete", `/admin/job-applications/${id}`);
      setApplications(applications.filter((a) => a.id !== id));
      showToast("Application deleted successfully!", "success");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete application.";
      showToast(message, "error");
    }
  };

  const filteredApplications = applications.filter((app) =>
    [app.full_name, app.email, app.job?.title].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const currentRows = filteredApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex justify-center w-full px-8 py-10">
<div className="bg-white p-10 rounded-2xl shadow-xl w-full">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#990e15]">Manage Job Applicants</h2>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or job title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#990e15]"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentRows.map((app) => (
                <TableRow key={app.id} className="hover:bg-gray-50">
                  <TableCell>{app.full_name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone_number}</TableCell>
                  <TableCell>{app.job?.title || "N/A"}</TableCell>
                  <TableCell className="text-center">
                    {app.resume ? (
                      <a
                        href={`${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:underline flex items-center justify-center gap-1"
                      >
                        <FaFilePdf /> View Resume
                      </a>
                    ) : (
                      <span>No Resume</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="border rounded-md p-2 focus:ring focus:ring-[#990e15]"
                    >
                      {["Pending", "Reviewed", "Shortlisted", "Rejected"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50 w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowMessageModal(true);
                          }}
                          className="cursor-pointer bg-white px-3 py-2 hover:bg-gray-100"
                        >
                          <FaEnvelope className="mr-2" /> Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteApplication(app.id)}
                          className="cursor-pointer bg-white px-3 py-2 text-red-600 hover:bg-red-100"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
        />

        {/* 🔥 Correct place to call your JobApplicationModal */}
        {showMessageModal && selectedApplication && (
  <JobApplicationModal
    open={showMessageModal}
    application={selectedApplication}
    onClose={() => {
      setShowMessageModal(false);
      setSelectedApplication(null);
    }}
  />
)}


      </div>
    </div>
  );
};

export default JobApplicationsTable;
