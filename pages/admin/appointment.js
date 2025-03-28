import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { FaPaperPlane, FaSyncAlt } from "react-icons/fa";
import { useToast } from "../../src/context/ToastContext";
import { getAppointments, updateAppointmentStatus, sendAppointmentMessage } from "../../src/utils/api";
import SEOComponent from "../../src/hooks/useSEO";
export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [adminEmail, setAdminEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast, toast } = useToast(); 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
    getAdminEmail();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const getAdminEmail = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminEmail(decoded.email);
    }
  };

  const updateStatus = async (id) => {
    try {
      if (!statusUpdate[id] || !statusUpdate[id].status) {
        showToast("Please select a status before updating.", "warning");
        return;
      }
      await updateAppointmentStatus(id, statusUpdate[id].status);
      showToast("Status updated successfully!", "success");
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status.", "error");
    }
  };

  const sendMessage = async (id) => {
    try {
      await sendAppointmentMessage(id, { admin_message: statusUpdate[id]?.admin_message });
      showToast("Message sent successfully!", "success");
      fetchAppointments();
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message.", "error");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = appointments.filter((appointment) =>
      (appointment.first_name?.toLowerCase() || "").includes(query) ||
      (appointment.last_name?.toLowerCase() || "").includes(query) ||
      (appointment.email?.toLowerCase() || "").includes(query) ||
      (appointment.message?.toLowerCase() || "").includes(query) ||
      (appointment.status?.toLowerCase() || "").includes(query)
    );
    setFilteredAppointments(filteredData);
  };

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const currentRows = filteredAppointments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout><SEOComponent />
      <div className="flex">
        <div className="flex-1"></div>
        <div className="w-[80%] p-6">
          <h2 className="text-2xl font-semibold text-[#990e15] mb-3">Manage Appointments</h2>
          <div className="relative mb-4 w-[50%]">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md p-2 w-full pl-10 text-sm focus:ring-2 focus:ring-[#990e15] transition"
            />
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-md">
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-[#990e15] text-white">
                <tr>
                  <th className="border p-2 w-[15%]">Name</th>
                  <th className="border p-2 w-[20%]">Email</th>
                  <th className="border p-2 w-[10%]">Date</th>
                  <th className="border p-2 w-[10%]">Time</th>
                  <th className="border p-2 w-[15%]">Message</th>
                  <th className="border p-2 w-[10%]">Status</th>
                  <th className="border p-2 w-[15%]">Reply</th>
                  <th className="border p-2 w-[10%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="border p-2 truncate">{appointment.first_name} {appointment.last_name}</td>
                    <td className="border p-2 truncate">{appointment.email}</td>
                    <td className="border p-2">{appointment.appointment_date}</td>
                    <td className="border p-2">{appointment.appointment_time}</td>
                    <td className="border p-2 truncate max-w-[150px]">{appointment.message}</td>
                    <td className="border p-2">
                      <select
                        value={statusUpdate[appointment.id]?.status || appointment.status || "pending"}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, [appointment.id]: { ...statusUpdate[appointment.id], status: e.target.value } })}
                        className="border p-2 rounded-md w-full text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <textarea
                        value={statusUpdate[appointment.id]?.admin_message || ""}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, [appointment.id]: { ...statusUpdate[appointment.id], admin_message: e.target.value } })}
                        placeholder="Reply..."
                        className="border p-2 w-full rounded-md text-xs focus:ring-2 focus:ring-[#990e15] transition"
                      />
                    </td>
                    <td className="border p-2 text-center flex justify-center space-x-2">
                      <button onClick={() => sendMessage(appointment.id)} className="flex items-center space-x-1 px-2 py-1 border border-[#990e15] text-[#990e15] rounded-md text-xs hover:bg-[#990e15] hover:text-white transition">
                        <FaPaperPlane className="text-xs" /> <span>Send</span>
                      </button>
                      <button onClick={() => updateStatus(appointment.id)} className="flex items-center space-x-1 px-2 py-1 bg-[#990e15] text-white rounded-md text-xs hover:opacity-80 transition">
                        <FaSyncAlt className="text-xs" /> <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-6">
              <button className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`} disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous</button>
              <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
              <button className={`px-4 py-2 rounded-md text-gray-600 bg-gray-200 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`} disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
