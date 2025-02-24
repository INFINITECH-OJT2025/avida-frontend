import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUser, updateProfile } from "../../utils/auth";
import { User, Mail, Lock, Phone, MapPin, Camera, ArrowLeft } from "lucide-react";
import "@/styles/globals.css";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const router = useRouter();

  // Store original values to detect changes
  const [originalValues, setOriginalValues] = useState({});

  // 🟢 Fetch user data on load
  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser();
      if (userData) {
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone_number || "");
        setAddress(userData.address || "");
        setPreviewPhoto(userData.profile_photo || "default-profile.svg");

        // Store original values
        setOriginalValues({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone_number || "",
          address: userData.address || "",
        });
      }
    }
    fetchUser();
  }, []);

  // 🟢 Check if there are any changes
  useEffect(() => {
    setIsChanged(
      name !== originalValues.name ||
      email !== originalValues.email ||
      phone !== originalValues.phone ||
      address !== originalValues.address ||
      password.length > 0 ||
      profilePhoto !== null
    );
  }, [name, email, phone, address, password, profilePhoto, originalValues]);

  // 🟢 Handle Profile Picture Upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  // 🟢 Handle Cancel - Go back to the previous page
  const handleBack = () => {
    router.back(); // Go to the previous page
  };

  // 🟢 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isChanged) return;

    const updatedFields = new FormData();

    if (name !== originalValues.name) updatedFields.append("name", name);
    if (email !== originalValues.email) updatedFields.append("email", email);
    if (phone !== originalValues.phone) updatedFields.append("phone_number", phone);
    if (address !== originalValues.address) updatedFields.append("address", address);
    if (password) updatedFields.append("password", password);
    if (profilePhoto) updatedFields.append("profile_photo", profilePhoto);

    try {
      await updateProfile(updatedFields);
      setSuccess("Profile updated successfully!");

      // Update original values after saving
      setOriginalValues({ name, email, phone, address });
      setPassword("");
      setIsChanged(false);

      // ✅ Redirect to dashboard after successful update
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Profile update failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <p className="text-gray-500 text-sm mb-4">Update your personal information</p>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture Upload */}
        <div className="text-center">
          <label htmlFor="profile-photo" className="cursor-pointer">
            <img
              src={previewPhoto}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full mx-auto shadow-md border border-gray-300"
            />
          </label>
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="text-gray-700 font-medium text-sm">Full Name</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <User className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-gray-700 font-medium text-sm">Email</label>
          <div className="relative">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-700 font-medium text-sm">New Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-gray-700 font-medium text-sm">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-gray-700 font-medium text-sm">Address</label>
          <div className="relative">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4 mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md flex items-center space-x-2"
          >
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={!isChanged}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
              isChanged ? "bg-[#990e15] text-white hover:bg-red-800" : "bg-[#990e15] opacity-50 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
