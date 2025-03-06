import axios from 'axios';

// ✅ Load API Base URL from Environment Variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

// ✅ Base API Configuration
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// ✅ Automatically attach token to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// ✅ Handle API Errors Globally
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt'); // ❌ Remove token if Unauthorized
    }
    return Promise.reject(error);
  }
);

// ✅ User Authentication (Login)
export const loginUser = async (credentials) => {
  try {
    const res = await API.post('/login', credentials);
    const { token } = res.data;
    localStorage.setItem('jwt', token); // ✅ Store token
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ User Logout
export const logoutUser = async () => {
  try {
    await API.post('/logout');
    localStorage.removeItem('jwt'); // ✅ Clear token
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch User Data (Authenticated)
export const fetchUser = async () => {
  try {
    const res = await API.get('/user');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Contacts
export const getContacts = async () => {
  try {
    const res = await API.get('/contacts');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Add New Contact (Admin)
export const addContact = async (contactData) => {
  try {
    const res = await API.post('/contacts', contactData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Update Contact (Admin)
export const updateContact = async (id, data) => {
  try {
    const res = await API.put(`/contacts/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Delete Contact (Admin)
export const deleteContact = async (id) => {
  try {
    await API.delete(`/contacts/${id}`);
    return { message: "Contact deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// ✅ Submit Inquiry (User)
export const submitInquiry = async (formData) => {
  try {
    const res = await API.post('/inquiries', formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Inquiries (Admin)
export const getInquiries = async () => {
  try {
    const res = await API.get('/inquiries');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Update Inquiry Status (Admin)
export const updateInquiryStatus = async (id, status) => {
  try {
    const res = await API.put(`/inquiries/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default API;
