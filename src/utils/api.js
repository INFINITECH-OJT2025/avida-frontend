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

// ✅ Automatically Attach Token to Requests
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

//
// 🔹 ADMIN DASHBOARD ANALYTICS API CALLS
//

// ✅ Fetch Admin Dashboard KPIs
export const fetchDashboardStats = async () => {
  try {
    const res = await API.get('/admin/dashboard/stats');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Property Listing Trends (For Graphs)
export const fetchPropertyTrends = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/admin/dashboard/property-trends");
    return await res.json();
  } catch (error) {
    console.error("Error fetching property trends:", error);
    throw error;
  }
};



// ✅ Fetch Inquiry Trends (For Graphs)
export const fetchInquiryTrends = async () => {
  try {
    const res = await API.get('/admin/dashboard/inquiry-trends');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Job Applications Trends (For Graphs)
export const fetchJobApplicationTrends = async () => {
  try {
    const res = await API.get('/admin/dashboard/job-application-trends');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Website Traffic Data (For Graphs)
export const fetchWebsiteTraffic = async () => {
  try {
    const response = await API.get('/admin/dashboard/traffic');
    return response.data;
  } catch (error) {
    console.error("Error fetching website traffic:", error);
    throw error;
  }
};


//
// 🔹 USER AUTHENTICATION API CALLS
//

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const res = await API.post('/login', credentials);
    localStorage.setItem('jwt', res.data.token); // ✅ Store token
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Logout User
export const logoutUser = async () => {
  try {
    await API.post('/logout');
    localStorage.removeItem('jwt'); // ✅ Clear token
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch Authenticated User Data
export const fetchUser = async () => {
  try {
    const res = await API.get('/user');
    return res.data;
  } catch (error) {
    throw error;
  }
};

//
// 🔹 CONTACT MANAGEMENT API CALLS
//

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
    const res = await API.delete(`/contacts/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//
// 🔹 INQUIRY MANAGEMENT API CALLS
//

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
