// src\components\admin\about\DescriptionDetails.js

import React from "react";
import { useToast } from "../../../../src/context/ToastContext";
import { callAPI } from "../../../utils/api"; // ✅ Centralized API utility

export default function DescriptionDetails({ form, handleChange }) {

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Company Descriptions</h2>
      {["brief_intro", "mission_statement", "vision_statement", "our_story", "evolution"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-600 font-medium">{field.replace(/_/g, " ").toUpperCase()}</label>
          <textarea
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          ></textarea>
        </div>
      ))}
    </div>
  );
}
