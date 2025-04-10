// File: C:/laragon/www/real-estate-frontend/utils/auth.js

const API_URL = "https://infinitech-api3.site/api";
const TOKEN_KEY = "jwt"; // Unified token key for consistency

// 🟢 Decode JWT Token to check expiration
export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        return Date.now() > expiry;
    } catch {
        return true;
    }
};

// 🟢 Get token from localStorage if not expired
export const getAuthToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && !isTokenExpired(token) ? token : null;
};

// 🟢 Register User (Admin Only)
export const registerUser = async (name, phone_number, address, email, password, profile_photo) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone_number", phone_number);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("password", password);
    if (profile_photo) formData.append("profile_photo", profile_photo);

    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized: Token not found or expired.");

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
    }

    return await response.json();
};

// 🟢 Login User
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials.");
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
};

// 🟢 Update Profile (with FormData)
export const updateProfile = async (formData) => {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized: Token not found or expired.");

    const response = await fetch(`${API_URL}/user/update-profile`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed.");
    }

    return await response.json();
};

// 🟢 Fetch Authenticated User
export const getUser = async () => {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("User fetch failed.");
    }

    return await response.json();
};

// 🟢 Logout User
export const logoutUser = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        });
    } catch (error) {
        console.warn("Logout failed:", error.message);
    } finally {
        localStorage.removeItem(TOKEN_KEY);
    }
};
