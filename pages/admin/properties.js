import { useState, useEffect } from "react";

export default function AdminProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/properties");
    
            // ✅ Check if response is OK
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            // ✅ Ensure JSON response
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid JSON response from server");
            }
    
            // ✅ Parse JSON safely
            const data = await response.json();
    
            if (!Array.isArray(data)) {
                throw new Error("Expected an array but got invalid data from API");
            }
    
            setProperties(data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/property/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating property: ${errorText}`);
            }
    
            await response.json();
            alert("Property status updated successfully!");
            fetchProperties(); // ✅ Refresh Data Immediately
        } catch (error) {
            console.error("Error updating property:", error);
            alert("Failed to update property. " + error.message);
        }
    };
    
    return (
        <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-[#990e15] mb-6">Manage Property Submissions</h2>

            {loading ? (
                <p>Loading properties...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-3 border">Property Name</th>
                            <th className="p-3 border">Owner</th>
                            <th className="p-3 border">Price</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <tr key={property.id} className="border-b">
                                    <td className="p-3 border">{property.property_name}</td>
                                    <td className="p-3 border">{property.first_name} {property.last_name}</td>
                                    <td className="p-3 border">₱ {property.price}</td>
                                    <td className="p-3 border">
    <span className={`px-2 py-1 rounded text-white ${
        property.status === "approved"
            ? "bg-green-500"
            : property.status === "pending"
            ? "bg-yellow-500"
            : "bg-red-500"
    }`}>
        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
    </span>
</td>

                                    <td className="p-3 border">
                                        <button
                                            onClick={() => updateStatus(property.id, "approved")}
                                            className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                                        >
                                            Publish
                                        </button>
                                        <button
                                            onClick={() => updateStatus(property.id, "rejected")}
                                            className="bg-red-500 text-white px-4 py-1 rounded"
                                        >
                                            Unpublish
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4">No properties found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
