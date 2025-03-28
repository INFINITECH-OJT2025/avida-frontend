import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "../../src/utils/auth";
import withAuth from "../../hoc/withAuth";
import SEOComponent from "../../src/hooks/useSEO";
function Register({ user }) {
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser(name, phone_number, address, email, password, profilePhoto);
      setSuccess("Registration successful!");
      // Optionally: Reset form or redirect
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  // ✅ Deny access if not admin
  if (user?.role !== "admin") {
    return <p className="text-red-500 text-center mt-20">🚫 Access denied. Admins only.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SEOComponent />
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleRegister} encType="multipart/form-data">
          <input type="text" placeholder="Full Name" className="w-full px-3 py-2 border rounded mb-4"
            value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border rounded mb-4"
            value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <input type="text" placeholder="Address" className="w-full px-3 py-2 border rounded mb-4"
            value={address} onChange={(e) => setAddress(e.target.value)} required />
          <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded mb-4"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded mb-4"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="file" accept="image/*" className="w-full px-3 py-2 border rounded mb-4"
            onChange={handleFileChange} />
          <button type="submit" className="w-full bg-[#990e15] text-white py-2 rounded hover:bg-[#7c0c12] transition">
            Register Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(Register); // ✅ Protect the page
