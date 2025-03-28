// src\components\admin\about\StatusControl.js
import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Use centralized API utility

export default function StatusControl({ form, setForm }) {
  const handleStatusChange = (e) => {
    setForm({ ...form, status: e.target.value });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Status</h2>
      <label className="block text-gray-600 font-medium">Status</label>
      <select
        name="status"
        value={form.status}
        onChange={handleStatusChange}
        className="border p-2 w-full rounded-md"
      >
        <option value="Published">Published</option>
        <option value="Unpublished">Unpublished</option>
      </select>
    </div>
  );
}

