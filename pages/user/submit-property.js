import { useState } from "react";

export default function SubmitProperty() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        type: "",
        property_name: "",
        unit_type: "",
        unit_status: "",
        location: "",
        price: "",
        square_meter: "",
        floor_number: "",
        parking: "",
        property_status: "",
        features_amenities: [],
        images: [],
    });

    const [errors, setErrors] = useState({});

    const amenitiesList = [
        "Pool Area",
        "Balcony/Terrace",
        "Elevator",
        "Guest Suite",
        "Club House",
        "Concierge Services",
        "Underground Parking",
        "Gym/Fitness Center",
        "Security",
        "Pet-Friendly Facilities",
    ];

    const unitTypes = ["Studio Room", "1BR", "2BR", "3BR", "Loft", "Penthouse"];
    const unitStatus = ["Bare", "Semi-Furnished", "Fully-Furnished", "Interiored"];
    const parkingOptions = ["With Parking", "No Parking"];
    const propertyStatusOptions = ["For Sale", "For Rent"];
    const userTypes = ["Owner", "Agent", "Broker"];
    const validateInput = (name, value) => {
        let errorMsg = "";

        if (name === "first_name" || name === "last_name") {
            if (!value.trim()) errorMsg = "This field is required.";
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) errorMsg = "Email is required.";
            else if (!emailRegex.test(value)) errorMsg = "Enter a valid email address.";
        }

        if (name === "phone_number") {
            const isValid = /^(09\d{9}|\+639\d{9})$/.test(value);
            if (!value.trim()) errorMsg = "Phone number is required.";
            else if (!isValid) errorMsg = "Use 09XXXXXXXXX or +639XXXXXXXXX format.";
        }

        if (["unit_type", "unit_status", "parking", "property_status"].includes(name)) {
            if (!value) errorMsg = "Please select an option.";
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        validateInput(name, value);
    };

    const handleCheckboxChange = (amenity) => {
        setForm((prevForm) => {
            const isSelected = prevForm.features_amenities.includes(amenity);
            return {
                ...prevForm,
                features_amenities: isSelected
                    ? prevForm.features_amenities.filter((item) => item !== amenity)
                    : [...prevForm.features_amenities, amenity],
            };
        });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        // Validate required fields before submission
        Object.keys(form).forEach((key) => {
            if (!form[key] || (Array.isArray(form[key]) && form[key].length === 0)) {
                validationErrors[key] = "This field is required.";
            }
        });

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const formData = new FormData();
        for (const key in form) {
            if (key === "images") {
                for (let i = 0; i < form.images.length; i++) {
                    formData.append("images[]", form.images[i]);
                }
            } else if (key === "features_amenities") {
                formData.append(key, JSON.stringify(form[key])); // Fix JSON format
            } else {
                formData.append(key, form[key]);
            }
        }
    
        try {
            const response = await fetch("http://127.0.0.1:8000/api/submit-property", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("Property submitted successfully!");
            } else {
                console.error("Error:", data);
                alert("Error submitting property: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    };
    
    return (
        <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">

            {/* Banner Section */}
            <div className="bg-[#990e15] text-white py-10 px-6 rounded-lg text-center shadow-md">
                <h1 className="text-4xl font-bold">Submit Your Property</h1>
                <p className="mt-2 text-lg">
                    List your property with us and reach thousands of potential buyers and renters.
                    Simply fill out the details below, and we'll take care of the rest!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-8">

                {/* Personal Information */}
                <div>
                    <h3 className="text-2xl font-semibold text-[#990e15]">Personal Information</h3>
                    <hr className="border-[#990e15] my-3" />
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[#990e15]">First Name</label>
                            <input type="text" name="first_name" placeholder="eg. Tanggol" required onChange={handleChange} className="p-2 border rounded w-full" />
                            {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Last Name</label>
                            <input type="text" name="last_name" placeholder="eg. Montenegro" required onChange={handleChange} className="p-2 border rounded w-full" />
                            {errors.last_name && <p className="text-red-600 text-sm">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Email</label>
                            <input type="email" name="email" placeholder="eg. tanggolmontenegro@gmail.com" required onChange={handleChange} className="p-2 border rounded w-full" />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Phone Number</label>
                            <input type="number" name="phone_number" placeholder="eg. 09998178431" required onChange={handleChange} className="p-2 border rounded w-full" />
                            {errors.phone_number && <p className="text-red-600 text-sm">{errors.phone_number}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Type</label>
                            <select name="type" onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">Select Type</option>
                                {userTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
                        </div>
                    </div>
                </div>

                {/* Property Information */}
                <div>
                    <h3 className="text-2xl font-semibold text-[#990e15]">Property Information</h3>
                    <hr className="border-[#990e15] my-3" />
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[#990e15]">Property Name</label>
                            <input type="text" name="property_name" placeholder="eg. Montenegro Resort" required onChange={handleChange} className="p-2 border rounded w-full" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Unit Type</label>
                            <select name="unit_type" required onChange={handleChange} className="p-2 border rounded w-full">
                                <option value="">Select Unit Type</option>
                                {unitTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Unit Status</label>
                            <select name="unit_status" required onChange={handleChange} className="p-2 border rounded w-full">
                                <option value="">Select Unit Status</option>
                                {unitStatus.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Location</label>
                            <input type="text" name="location" placeholder="eg. Quiapo, Manila, Metro Manila" required onChange={handleChange} className="p-2 border rounded w-full" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Property Price</label>
                            <input type="number" name="price" placeholder="eg. 0.00" required onChange={handleChange} className="p-2 border rounded w-full" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Square Meter</label>
                            <input type="number" name="square_meter" placeholder="eg. 0.00" required onChange={handleChange} className="p-2 border rounded w-full" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Floor Number</label>
                            <input type="number" name="floor_number" placeholder="eg. 0.00" required onChange={handleChange} className="p-2 border rounded w-full" />
                        </div>

                        <div>
                            <label className="text-[#990e15]">Parking</label>
                            <select name="parking" required onChange={handleChange} className="p-2 border rounded w-full">
                                <option value="">Select Parking</option>
                                {parkingOptions.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Property Status</label>
                            <select name="property_status" required onChange={handleChange} className="p-2 border rounded w-full">
                                <option value="">Property Status</option>
                                {propertyStatusOptions.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Features & Amenities */}
                <div><h3 className="text-2xl font-semibold text-[#990e15]">Features and Amenities</h3>
                    <hr className="border-[#990e15] my-3" />
                    <div className="grid grid-cols-3 gap-4">
                        {amenitiesList.map((amenity) => (
                            <label key={amenity} className="flex items-center">
                                <input type="checkbox" value={amenity} onChange={() => handleCheckboxChange(amenity)} className="mr-2" />
                                {amenity}
                            </label>
                        ))}
                    </div></div>


                {/* Image Upload */}
                <div>
                    <h3 className="text-2xl font-semibold text-[#990e15]">Property Images</h3>
                    <hr className="border-[#990e15] my-3" />
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="p-2 border rounded w-full" />
                </div>

                <button type="submit" className="bg-[#990e15] text-white p-3 rounded w-full text-lg font-semibold shadow-md">
                    Submit Property
                </button>
            </form>
        </div>
    );
}
