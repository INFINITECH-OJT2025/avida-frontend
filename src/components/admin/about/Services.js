import React from "react";

export default function Services({ form, handleChange }) {
    const fields = ["real_estate_services", "property_types", "investment_opportunities", "customer_segments"];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Real Estate Services</h2>
            {fields.map((field) => (
                <div key={field}>
                    <label className="block text-gray-600 font-medium">{field.replace(/_/g, " ").toUpperCase()} (Comma-separated)</label>
                    <input type="text" name={field} value={form[field]} onChange={handleChange} className="border p-2 w-full rounded-md" />
                </div>
            ))}
        </div>
    );
}
