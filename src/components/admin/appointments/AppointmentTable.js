// src/components/admin/appointments/AppointmentTable.js
import { useState, useEffect } from "react";
import { FaPaperPlane, FaSyncAlt } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import {
  getAppointments,
  updateAppointmentStatus,
  sendAppointmentMessage,
} from "@/utils/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/shared/TablePagination";

export default function AppointmentTable({ adminEmail }) {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
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
      await sendAppointmentMessage(id, {
        admin_message: statusUpdate[id]?.admin_message,
      });
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
  const currentRows = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex justify-end pl-40">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#990e15]">
            Manage Appointments
          </h2>
        </div>

        {/* <div className="mb-6">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-2 focus:ring-[#990e15] transition"
          />
        </div> */}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reply</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRows.length > 0 ? (
                currentRows.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell>{appointment.first_name} {appointment.last_name}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.appointment_date}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>{appointment.message}</TableCell>
                    <TableCell>
                      <select
                        value={statusUpdate[appointment.id]?.status || appointment.status || "pending"}
                        onChange={(e) =>
                          setStatusUpdate({
                            ...statusUpdate,
                            [appointment.id]: {
                              ...statusUpdate[appointment.id],
                              status: e.target.value,
                            },
                          })
                        }
                        className="border p-2 rounded-md w-full text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <textarea
                        value={statusUpdate[appointment.id]?.admin_message || ""}
                        onChange={(e) =>
                          setStatusUpdate({
                            ...statusUpdate,
                            [appointment.id]: {
                              ...statusUpdate[appointment.id],
                              admin_message: e.target.value,
                            },
                          })
                        }
                        placeholder="Reply..."
                        className="border p-2 w-full rounded-md text-xs focus:ring-2 focus:ring-[#990e15] transition"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => sendMessage(appointment.id)}
                          variant="outline"
                          className="text-[#990e15] border-[#990e15] hover:bg-[#990e15] hover:text-white text-xs px-2"
                        >
                          <FaPaperPlane className="text-xs mr-1" /> Send
                        </Button>
                        <Button
                          onClick={() => updateStatus(appointment.id)}
                          className="bg-[#990e15] hover:bg-[#7d0d12] text-white text-xs px-2"
                        >
                          <FaSyncAlt className="text-xs mr-1" /> Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
