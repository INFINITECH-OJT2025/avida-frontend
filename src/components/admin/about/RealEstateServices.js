// src\components\admin\about\RealEstateServices.js
import React from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api";

export default function RealEstateServices({ form, handleChange }) {
  
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Real Estate Services</h2>

      <div>
        <label className="block text-gray-600 font-medium">Services Offered (Comma-separated)</label>
        <input
          type="text"
          name="real_estate_services"
          value={form.real_estate_services}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
          placeholder="e.g., Property Development, Sales & Marketing"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Property Types (Comma-separated)</label>
        <input
          type="text"
          name="property_types"
          value={form.property_types}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
          placeholder="e.g., Condominiums, House-and-Lot, Townhouses"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Investment Opportunities (Comma-separated)</label>
        <input
          type="text"
          name="investment_opportunities"
          value={form.investment_opportunities}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
          placeholder="e.g., Pre-selling, Rental properties"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Customer Segments (Comma-separated)</label>
        <input
          type="text"
          name="customer_segments"
          value={form.customer_segments}
          onChange={handleChange}
          className="border p-2 w-full rounded-md"
          placeholder="e.g., Young professionals, OFWs, Retirees"
        />
      </div>

    </div>
  );
}
