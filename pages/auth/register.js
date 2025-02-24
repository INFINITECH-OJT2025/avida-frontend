import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "../../utils/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // ✅ Store file
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(name, phone_number, address, email, password, profilePhoto);
      router.push("/auth/login"); // ✅ Redirect to login
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
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
          {/* Profile Photo Upload */}
          <input type="file" accept="image/*" className="w-full px-3 py-2 border rounded mb-4" onChange={handleFileChange} />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
}
