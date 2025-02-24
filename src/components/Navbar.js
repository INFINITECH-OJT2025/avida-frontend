import { logoutUser } from "../../utils/auth";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-lg font-bold">Real Estate Platform</h1>
      <button onClick={logoutUser} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </nav>
  );
}
const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    window.location.href = "/auth/login"; // ✅ Redirect to login
  };
  