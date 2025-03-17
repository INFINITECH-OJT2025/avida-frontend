import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { FaPaperPlane, FaSyncAlt } from "react-icons/fa";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [adminEmail, setAdminEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAppointments();
    getAdminEmail();
  }, []);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/appointments");
      setAppointments(response.data);
      setFilteredAppointments(response.data); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Extract admin email from JWT token
  const getAdminEmail = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAdminEmail(decoded.email);
    }
  };

  // Update appointment status
  const updateStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!statusUpdate[id] || !statusUpdate[id].status) {
        alert("Please select a status before updating.");
        return;
      }
  
      await axios.patch(
        `http://127.0.0.1:8000/api/appointments/${id}/status`,
        { status: statusUpdate[id].status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Status updated successfully!");
      fetchAppointments(); // Refresh the data after updating
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };
  

  // Send message separately
  const sendMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://127.0.0.1:8000/api/appointments/${id}/message`,
        { admin_message: statusUpdate[id]?.admin_message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Message sent successfully!");
      fetchAppointments(); // Refresh data
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  // Search Functionality
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
  

  return (
    <AdminLayout>
      <div className="flex">
        {/* Sidebar Adjustment - Ensures it doesn't overlap */}
        <div className="flex-1"></div>

        {/* Main Content - Shifts to the Right */}
        <div className="w-[80%] p-6">
          <h2 className="text-2xl font-semibold text-[#990e15] mb-3">Manage Appointments</h2>

          {/* Search Bar */}
          <div className="relative mb-4 w-[50%]">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md p-2 w-full pl-10 text-sm focus:ring-2 focus:ring-[#990e15] transition"
            />
            <span className="absolute left-3 top-2 text-gray-500 text-sm"></span>
          </div>

          {/* Table */}
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
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="border p-2 truncate">{appointment.first_name} {appointment.last_name}</td>
                    <td className="border p-2 truncate">{appointment.email}</td>
                    <td className="border p-2">{appointment.appointment_date}</td>
                    <td className="border p-2">{appointment.appointment_time}</td>
                    <td className="border p-2 truncate max-w-[150px]">{appointment.message}</td>
                    <td className="border p-2">
  <select
    value={statusUpdate[appointment.id]?.status || appointment.status || "pending"}
    onChange={(e) =>
      setStatusUpdate({
        ...statusUpdate,
        [appointment.id]: { ...statusUpdate[appointment.id], status: e.target.value },
      })
    }
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
                        onChange={(e) =>
                          setStatusUpdate({
                            ...statusUpdate,
                            [appointment.id]: { ...statusUpdate[appointment.id], admin_message: e.target.value },
                          })
                        }
                        placeholder="Reply..."
                        className="border p-2 w-full rounded-md text-xs focus:ring-2 focus:ring-[#990e15] transition"
                      />
                    </td>
                    <td className="border p-2 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => sendMessage(appointment.id)}
                        className="flex items-center space-x-1 px-2 py-1 border border-[#990e15] text-[#990e15] rounded-md text-xs hover:bg-[#990e15] hover:text-white transition"
                      >
                        <FaPaperPlane className="text-xs" /> <span>Send</span>
                      </button>
                      <button
                        onClick={() => updateStatus(appointment.id)}
                        className="flex items-center space-x-1 px-2 py-1 bg-[#990e15] text-white rounded-md text-xs hover:opacity-80 transition"
                      >
                        <FaSyncAlt className="text-xs" /> <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
