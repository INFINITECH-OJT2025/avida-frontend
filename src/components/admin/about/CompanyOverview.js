// src\components\admin\about\CompanyOverview.js
import React from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Reusable API utility

export default function CompanyOverview({ form, handleChange }) {


  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Company Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Established Year</label>
          <input
            type="number"
            name="established_year"
            value={form.established_year}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Parent Company</label>
        <input
          type="text"
          name="parent_company"
          value={form.parent_company}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Company Slogan</label>
        <input
          type="text"
          name="company_slogan"
          value={form.company_slogan}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
        />
      </div>
    </div>
  );
}
