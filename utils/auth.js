// C:\laragon\www\real-estate-frontend\utils\auth.js
const API_URL = "http://127.0.0.1:8000/api"; // Change if using a different backend URL

// 🟢 Register User
export const registerUser = async (name, phone_number, address, email, password, profile_photo) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone_number", phone_number);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("password", password);

    if (profile_photo) {
        formData.append("profile_photo", profile_photo);
    }

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Accept": "application/json", // ✅ Do NOT set "Content-Type" for FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
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
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // ✅ Store JWT token

    return data;
};

export const updateProfile = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No Token Found");

        const response = await fetch(`${API_URL}/user/update-profile`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, // Must use FormData for file upload
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Profile update failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};


// 🟢 Fetch Authenticated User
export const getUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            logoutUser();
            return null;
        }

        const response = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("User fetch failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};


// 🟢 Logout User
export const logoutUser = () => {
    localStorage.removeItem("token"); // Remove JWT token
    window.location.href = "/auth/login"; // Redirect to login page
};

// 🟢 Decode JWT Token to check expiration
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const expiry = payload.exp * 1000; // Convert expiry to milliseconds
        return Date.now() > expiry; // Return true if token is expired
    } catch (error) {
        return true; // If token is invalid, consider it expired
    }
};
