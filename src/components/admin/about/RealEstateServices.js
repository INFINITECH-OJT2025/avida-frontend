import React from "react";
import axios from "axios";

export default function RealEstateServices({ form, handleChange }) {
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Ensure company_name is included for validation
        const payload = {
            company_name: form.company_name, // Required field
            real_estate_services: form.real_estate_services || "",
            property_types: form.property_types || "",
            investment_opportunities: form.investment_opportunities || "",
            customer_segments: form.customer_segments || ""
        };

        console.log("Submitting Data:", payload); // Debugging log

        try {
            const response = await axios.put("/api/admin/about-us/update", payload, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Update Response:", response.data);
            alert("Real Estate Services Updated!");
        } catch (error) {
            console.error("Error Response:", error.response);
            if (error.response?.data?.errors) {
                alert(`Validation Error: ${JSON.stringify(error.response.data.errors, null, 2)}`);
            } else {
                alert("Error updating Real Estate Services");
            }
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-bold mb-4">Real Estate Services</h2>

            <div>
                <label className="block text-gray-600 font-medium">Services Offered (Comma-separated)</label>
                <input type="text" name="real_estate_services" value={form.real_estate_services} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="e.g., Property Development, Sales & Marketing" />
            </div>

            <div>
                <label className="block text-gray-600 font-medium">Property Types (Comma-separated)</label>
                <input type="text" name="property_types" value={form.property_types} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="e.g., Condominiums, House-and-Lot, Townhouses" />
            </div>

            <div>
                <label className="block text-gray-600 font-medium">Investment Opportunities (Comma-separated)</label>
                <input type="text" name="investment_opportunities" value={form.investment_opportunities} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="e.g., Pre-selling, Rental properties" />
            </div>

            <div>
                <label className="block text-gray-600 font-medium">Customer Segments (Comma-separated)</label>
                <input type="text" name="customer_segments" value={form.customer_segments} onChange={handleChange} className="border p-2 w-full rounded-md" placeholder="e.g., Young professionals, OFWs, Retirees" />
            </div>

            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">Save</button>
        </div>
    );
}
