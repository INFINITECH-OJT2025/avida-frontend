// src\components\admin\job\JobApplicationRow.js
import { useToast } from "../../../context/ToastContext"; // adjust if path differs
import { callAPI } from "../../../utils/api"; // ✅ Import reusable API utility

const JobApplicationRow = ({ app, setApplications, applications, onOpen }) => {
  const { showToast } = useToast();
  if (!app) return null;
  const updateStatus = async (id, status) => {
    try {
      await callAPI("patch", `/admin/job-applications/${id}/status`, { status });
      setApplications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast("Status updated successfully.", "success");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status.";
      showToast(msg, "error");
    }
  };
  

  const deleteApplication = async (id) => {
    if (!id) {
      showToast("Invalid Application ID", "error");
      return;
    }
  
    try {
      await callAPI("delete", `/admin/job-applications/${id}`);
      setApplications(applications.filter((a) => a.id !== id));
      showToast("Application deleted successfully.", "success");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete application.";
      showToast(msg, "error");
    }
  };
  

  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="p-3">{app.full_name}</td>
      <td className="p-3">{app.email}</td>
      <td className="p-3">{app.phone_number}</td>
      <td className="p-3">{app.job?.title || "N/A"}</td>
      <td className="p-3">
        <select
          value={app.status}
          onChange={(e) => updateStatus(app.id, e.target.value)}
          className="border rounded-md p-1"
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td className="p-3 flex space-x-2">
        <button className="text-blue-600 hover:underline" onClick={onOpen}>View</button>
        <button className="text-red-600 hover:underline" onClick={() => deleteApplication(app.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default JobApplicationRow;
