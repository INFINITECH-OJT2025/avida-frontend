// src\components\admin\about\Features.js
import React from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Import centralized API

export default function Features({ form, handleChange }) {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Company Features</h2>
      {["quality_innovation", "prime_locations", "affordability_financing", "sustainability"].map((field) => (
        <div key={field}>
          <label className="block text-gray-600 font-medium">{field.replace(/_/g, " ").toUpperCase()}</label>
          <textarea
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>
      ))}
    </div>
  );
}
