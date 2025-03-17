// src\components\admin\job\JobApplicationRow.js
const JobApplicationRow = ({ app, setApplications, applications, onOpen }) => {
    const updateStatus = async (id, status) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/job-applications/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
  
        if (!response.ok) throw new Error("Failed to update status");
  
        setApplications(applications.map((a) => (a.id === id ? { ...a, status } : a)));
      } catch (err) {
        console.error("Error updating status:", err);
      }
    };
  
    const deleteApplication = async (id) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/job-applications/${id}`, { method: "DELETE" });
  
        if (!response.ok) throw new Error("Failed to delete application");
  
        setApplications(applications.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error deleting application:", err);
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
  