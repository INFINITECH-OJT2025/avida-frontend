import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../../src/utils/auth";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../src/context/ToastContext";
import "../../src/styles/globals.css";
import SEOComponent from "../../src/hooks/useSEO";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  // ✅ Show toast based on email verification result
  useEffect(() => {
    const { verified } = router.query;
    if (verified === "success") {
      showToast("Email verified successfully. You may now log in.", "success");
    } else if (verified === "already") {
      showToast("Your email is already verified.", "info");
    } else if (verified === "fail") {
      showToast("Invalid or expired verification link.", "error");
    }
  }, [router.query]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      showToast("Login successful! Redirecting...", "success");
      router.push("/admin/dashboard");
    } catch (err) {
      showToast("Invalid email or password", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SEOComponent />
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your credentials to access the admin panel
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium text-sm">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 pr-10 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#990e15] text-white py-2 rounded-md font-semibold hover:bg-red-700 transition-all duration-300"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
