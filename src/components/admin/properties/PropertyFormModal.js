import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { adminAddProperty, adminUpdateProperty } from "@/utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import GlobalLoader from "@/components/layout/GlobalLoader";

const unitTypes = ["Studio Room", "1BR", "2BR", "3BR", "Loft", "Penthouse"];
const unitStatus = ["Bare", "Semi-Furnished", "Fully-Furnished", "Interiored"];
const parkingOptions = ["With Parking", "No Parking"];
const propertyStatusOptions = ["For Sale", "For Rent"];
const userTypes = ["Owner", "Agent", "Broker"];
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

export default function PropertyFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const { showToast } = useToast();
  const fileInputRef = useRef();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    type: "Owner",
    property_name: "",
    location: "",
    unit_type: "Studio Room",
    unit_status: "Bare",
    price: "",
    square_meter: "",
    floor_number: "",
    parking: "No Parking",
    property_status: "For Rent",
    features_amenities: [],
    lightbox2_media: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        features_amenities: Array.isArray(initialData.features_amenities)
          ? initialData.features_amenities
          : JSON.parse(initialData.features_amenities || "[]"),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Add phone validation on input
    if (name === "phone_number") {
      const cleaned = value.replace(/[^0-9]/g, "");
      if (cleaned.length <= 11) {
        setFormData((prev) => ({
          ...prev,
          [name]: cleaned,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      if (!/^09\d{9}$/.test(value)) {
        showToast("Phone number must start with 09 and be exactly 11 digits.", "error");
      }
    }

    if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showToast("Please enter a valid email address.", "error");
        }
      }
      
  };

  const handleCheckboxChange = (amenity) => {
    setFormData((prev) => {
      const isSelected = prev.features_amenities.includes(amenity);
      return {
        ...prev,
        features_amenities: isSelected
          ? prev.features_amenities.filter((item) => item !== amenity)
          : [...prev.features_amenities, amenity],
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.includes("image") ? "image" : "video",
    }));
    setImages(previews);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // 🟢 Start loader
  
      const payload = new FormData();
      for (const key in formData) {
        if (key === "features_amenities") {
          payload.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== "" && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      }
  
      images.forEach(({ file }) => {
        payload.append("lightbox2_media[]", file);
      });
  
      if (!initialData) {
        if (!/^09\d{9}$/.test(formData.phone_number)) {
          showToast("Phone number must start with 09 and be 11 digits.", "error");
          setLoading(false);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          showToast("Please enter a valid email address.", "error");
          setLoading(false);
          return;
        }
      }
  
      if (initialData) {
        await adminUpdateProperty(initialData.id, payload);
        showToast("Property updated successfully!", "success");
      } else {
        await adminAddProperty(payload);
        showToast("Property added successfully!", "success");
      }
  
      onClose();
      onSuccess();
    } catch (error) {
      showToast("Something went wrong while submitting the form.", "error");
      console.error("Property Form Error:", error);
    } finally {
      setLoading(false); // 🔴 End loader
    }
    console.log("Submitting payload to:", initialData ? "UPDATE" : "ADD");
for (let pair of payload.entries()) {
  console.log(pair[0], pair[1]);
}

  };
  
  
  return (
    <>  <GlobalLoader show={loading} />
    <Dialog open={isOpen} onOpenChange={onClose} className="flex justify-end pl-40">
      <DialogContent >
        <DialogHeader> 
          <DialogTitle>{initialData ? "Edit Property" : "Add New Property"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div><label className="text-sm font-semibold">First Name</label><Input name="first_name" value={formData.first_name} onChange={handleChange} /></div>
          <div><label className="text-sm font-semibold">Last Name</label><Input name="last_name" value={formData.last_name} onChange={handleChange} /></div>
          <div><label className="text-sm font-semibold">Email</label><Input name="email" value={formData.email}  onChange={handleChange}  onBlur={handleBlur}  /></div>
          <div><label className="text-sm font-semibold">Phone Number</label><Input name="phone_number" value={formData.phone_number} onChange={handleChange} onBlur={handleBlur} /></div>

          <div>
            <label className="text-sm font-semibold">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-full">
              {userTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div><label className="text-sm font-semibold">Property Name</label><Input name="property_name" value={formData.property_name} onChange={handleChange} /></div>
          <div><label className="text-sm font-semibold">Location</label><Input name="location" value={formData.location} onChange={handleChange} /></div>

          <div>
            <label className="text-sm font-semibold">Unit Type</label>
            <select name="unit_type" value={formData.unit_type} onChange={handleChange} className="border p-2 rounded w-full">
              {unitTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Unit Status</label>
            <select name="unit_status" value={formData.unit_status} onChange={handleChange} className="border p-2 rounded w-full">
              {unitStatus.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div><label className="text-sm font-semibold">Price</label><Input name="price" type="number" value={formData.price} onChange={handleChange} /></div>
          <div><label className="text-sm font-semibold">Square Meter</label><Input name="square_meter" type="number" value={formData.square_meter} onChange={handleChange} /></div>
          <div><label className="text-sm font-semibold">Floor Number</label><Input name="floor_number" type="number" value={formData.floor_number} onChange={handleChange} /></div>
{/* Parking */}
<div>
            <label className="text-sm font-semibold">Parking</label>
            <select name="parking" value={formData.parking} onChange={handleChange} className="border p-2 rounded w-full">
              {parkingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Property Status */}
          <div>
            <label className="text-sm font-semibold">Property Status</label>
            <select name="property_status" value={formData.property_status} onChange={handleChange} className="border p-2 rounded w-full">
              {propertyStatusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Upload Images */}
          <div>
            <label className="text-sm font-semibold text-[#990e15]">Upload Media</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleImageUpload}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Preview Images */}
          {images.length > 0 && (
            <div className="col-span-1">
            <label className="text-sm font-semibold text-[#990e15]">Upload Media</label>
              <PhotoProvider>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  modules={[Navigation]}
                  className="w-full max-w-xs"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative group rounded overflow-hidden border border-gray-300 w-full h-[120px]">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs hidden group-hover:block"
                        >
                          ✕
                        </button>
                        {img.type === "image" ? (
                          <PhotoView src={img.url}>
                            <img
                              src={img.url}
                              alt="Preview"
                              className="w-full h-full object-cover cursor-pointer"
                            />
                          </PhotoView>
                        ) : (
                          <video
                            src={img.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </PhotoProvider>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <p className="text-sm font-semibold">Select Amenities</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.features_amenities.includes(amenity)}
                  onChange={() => handleCheckboxChange(amenity)}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#990e15] text-white" onClick={handleSubmit}>
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
      </>
  );

}


