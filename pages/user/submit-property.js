import { useState } from "react";
import Header from "../../src/components/Header"; // ✅ Import Header

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
        panolens_images: [],
        lightbox2_media: [],
    });

    const [errors, setErrors] = useState({});
    const [previewMedia, setPreviewMedia] = useState({ panolens: [], lightbox2: [] });

    // ✅ Function to check file types
    const isVideo = (file) => /\.(mp4|mov|avi|mkv)$/i.test(file.name);
    const isImage = (file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
    const is360Image = (file) => isImage(file) && file.name.toLowerCase().includes("360");

    const handlePanolensUpload = (e) => {
        const files = Array.from(e.target.files).filter(is360Image);

        if (files.length === 0) {
            alert("Please upload valid 360° image files.");
            return;
        }

        setForm(prevForm => ({
            ...prevForm,
            panolens_images: [...prevForm.panolens_images, ...files],
        }));

        const previews = files.map(file => ({
            name: file.name,
            type: "360",
            url: URL.createObjectURL(file),
        }));

        setPreviewMedia(prevMedia => ({
            ...prevMedia,
            panolens: [...prevMedia.panolens, ...previews],
        }));
    };

    const handleLightboxUpload = (e) => {
        const files = Array.from(e.target.files).filter(file => isImage(file) || isVideo(file));

        if (files.length === 0) {
            alert("Please upload valid image or video files.");
            return;
        }

        setForm(prevForm => ({
            ...prevForm,
            lightbox2_media: [...prevForm.lightbox2_media, ...files],
        }));

        const previews = files.map(file => ({
            name: file.name,
            type: isVideo(file) ? "video" : "image",
            url: URL.createObjectURL(file),
        }));

        setPreviewMedia(prevMedia => ({
            ...prevMedia,
            lightbox2: [...prevMedia.lightbox2, ...previews],
        }));
    };

    // ✅ Function to format the price
    const formatNumber = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("en-PH", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(value));
    };

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

        if (!value.trim()) {
            errorMsg = "This field is required.";
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) errorMsg = "Enter a valid email address.";
        } else if (name === "phone_number") {
            const isValid = /^(09\d{9}|\+639\d{9})$/.test(value);
            if (!isValid) errorMsg = "Use 09XXXXXXXXX or +639XXXXXXXXX format.";
        }

        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        validateInput(name, value);

        if (name === "price") {
            const rawValue = value.replace(/,/g, "").replace(/[^0-9.]/g, "");
            setForm((prev) => ({ ...prev, [name]: rawValue }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === "price" && value) {
            // Format price with commas on blur
            const formattedValue = parseFloat(value).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            setForm({ ...form, [name]: formattedValue });
        }
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

    // ✅ Handle file uploads
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => isImage(file) || isVideo(file) || is360Image(file));

        if (validFiles.length === 0) {
            alert("Please upload valid image, video, or 360° files.");
            return;
        }

        setForm(prevForm => ({
            ...prevForm,
            images: [...prevForm.images, ...validFiles],
        }));

        const previews = validFiles.map(file => ({
            name: file.name,
            type: isVideo(file) ? "video" : is360Image(file) ? "360" : "image",
            url: URL.createObjectURL(file),
        }));

        setPreviewMedia(prevMedia => [...prevMedia, ...previews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        Object.keys(form).forEach((key) => {
            if (!form[key] || (Array.isArray(form[key]) && form[key].length === 0)) {
                validationErrors[key] = "This field is required.";
            }
        });

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const formData = new FormData();

        for (const key in form) {
            if (key === "panolens_images" || key === "lightbox2_media") {
                form[key].forEach(file => formData.append(`${key}[]`, file));
            } else if (key === "features_amenities") {
                formData.append(key, JSON.stringify(form[key]));
            } else if (key === "price") {
                // ✅ Convert price to a numeric value before submitting
                formData.append(key, parseFloat(form[key].replace(/,/g, "")));
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

    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/,/g, ""); // Remove existing commas
        value = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal

        // Prevent multiple decimals
        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }

        setForm((prev) => ({ ...prev, price: value }));
    };

    const handlePriceBlur = (e) => {
        let value = e.target.value;
        if (!value) return;

        // Convert to float and format with commas
        const formattedValue = parseFloat(value).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setForm((prev) => ({ ...prev, price: formattedValue }));
    };


    return (
        <div><Header/>
<div className="p-10 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-lg shadow-xl">


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
                            <input type="text" name="first_name" placeholder="eg. Tanggol" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            {errors.first_name && <p className="text-red-600 dark:text-red-400 text-sm">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Last Name</label>
                            <input type="text" name="last_name" placeholder="eg. Montenegro" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            {errors.last_name && <p className="text-red-600 dark:text-red-400 text-sm">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Email</label>
                            <input type="email" name="email" placeholder="eg. tanggolmontenegro@gmail.com" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            {errors.email && <p className="text-red-600 dark:text-red-400 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Phone Number</label>
                            <input type="number" name="phone_number" placeholder="eg. 09998178431" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            {errors.phone_number && <p className="text-red-600 dark:text-red-400 text-sm">{errors.phone_number}</p>}
                        </div>
                        <div>
                            <label className="text-[#990e15]">Type</label>
                            <select name="type" onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Type</option>
                                {userTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            {errors.type && <p className="text-red-600 dark:text-red-400 text-sm">{errors.type}</p>}
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
                            <input type="text" name="property_name" placeholder="eg. Montenegro Resort" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Unit Type</label>
                            <select name="unit_type" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Unit Type</option>
                                {unitTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Unit Status</label>
                            <select name="unit_status" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Unit Status</option>
                                {unitStatus.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Location</label>
                            <input type="text" name="location" placeholder="eg. Quiapo, Manila, Metro Manila" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Property Price</label>
                            <input
                                type="text"
                                name="price"
                                value={form.price}
                                onChange={handlePriceChange}
                                onBlur={handlePriceBlur}
                                placeholder="Enter price (e.g., 1,000,000.00)"
                                 className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {errors.price && <p className="text-red-600 dark:text-red-400 text-sm">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="text-[#990e15]">Square Meter</label>
                            <input type="number" name="square_meter" placeholder="eg. 0.00" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-[#990e15]">Floor Number</label>
                            <input type="number" name="floor_number" placeholder="eg. 0.00" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div>
                            <label className="text-[#990e15]">Parking</label>
                            <select name="parking" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Parking</option>
                                {parkingOptions.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[#990e15]">Property Status</label>
                            <select name="property_status" required onChange={handleChange}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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


                <div>
                    <label className="text-[#990e15]">Upload Panorama Images (Optional)</label>
                    <input type="file" multiple accept="image/*" onChange={handlePanolensUpload}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                {/* ✅ Upload Normal Images & Videos for Lightbox2 */}
                <div>
                    <label className="text-[#990e15]">Upload Images & Videos</label>
                    <input type="file" required multiple accept="image/*, video/*" onChange={handleLightboxUpload}  className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                {/* ✅ Preview Uploaded Media */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {/* Preview 360° Images */}
                    {previewMedia.panolens.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-[#990e15]">Panorama Images (Optional)</h4>
                            {previewMedia.panolens.map((media, index) => (
                                <iframe key={index} src={media.url} className="w-full h-40 rounded-lg shadow-md" allowFullScreen></iframe>
                            ))}
                        </div>
                    )}

                    {/* Preview Lightbox2 Images & Videos */}
                    {previewMedia.lightbox2.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        {previewMedia.lightbox2.map((media, index) => (
                          media.type === "image" ? (
                            <img key={index} src={media.url} alt="Image Preview" className="w-full h-40 object-cover rounded-lg shadow-md" />
                          ) : (
                            <video key={index} src={media.url} controls className="w-full h-40 object-cover rounded-lg shadow-md" />
                          )
                        ))}
                      </div>
                      
                    )}
                </div>


                <button 
  type="submit" 
  className="bg-[#990e15] text-white p-3 rounded w-full text-lg font-semibold shadow-md hover:bg-[#b31218] transition"
>
  Submit Property
</button>
            </form>
        </div></div>
        );
}
