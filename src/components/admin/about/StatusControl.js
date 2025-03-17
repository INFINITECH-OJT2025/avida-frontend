import React, { useState } from "react";
import axios from "axios";

export default function StatusControl({ form, setForm }) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (e) => {
        setForm({ ...form, status: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized! Please log in again.");
                return;
            }

            const response = await axios.put("/api/admin/about-us/update-status", { status: form.status }, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            alert("Status Updated Successfully!");
        } catch (error) {
            console.error("Error updating status:", error.response?.data);
            alert("Error updating status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <label className="block text-gray-600 font-medium">Status</label>
            <select name="status" value={form.status} onChange={handleStatusChange} className="border p-2 w-full rounded-md">
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
            </select>
            <button onClick={handleSubmit} className="bg-[#990e15] text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
