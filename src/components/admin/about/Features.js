import React from "react";
import axios from "axios";

export default function Features({ form, handleChange }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure company_name is included to pass validation
        const payload = {
            company_name: form.company_name, // ✅ Required field
            quality_innovation: form.quality_innovation || "",
            prime_locations: form.prime_locations || "",
            affordability_financing: form.affordability_financing || "",
            sustainability: form.sustainability || "",
            awards: form.awards
        };
    
        console.log("Submitting Data:", payload); // ✅ Debugging
    
        try {
            const response = await axios.put("/api/admin/about-us/update", payload, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
    
            console.log("Update Response:", response.data);
            alert("Features Updated!");
        } catch (error) {
            console.error("Error Response:", error.response);
            if (error.response?.data?.errors) {
                alert(`Validation Error: ${JSON.stringify(error.response.data.errors, null, 2)}`);
            } else {
                alert("Error updating Features");
            }
        }
    };
    return (
        <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-bold mb-4">Company Features</h2>
            {["quality_innovation", "prime_locations", "affordability_financing", "sustainability"].map((field) => (
                <div key={field}>
                    <label className="block text-gray-600 font-medium">{field.replace(/_/g, " ").toUpperCase()}</label>
                    <textarea name={field} value={form[field]} onChange={handleChange} className="border p-2 w-full rounded-md"></textarea>
                </div>
            ))}
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">Save</button>
        </div>
    );
}
