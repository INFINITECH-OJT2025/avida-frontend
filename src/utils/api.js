// utils/api.js
import axios from "axios";
import { useToast } from "../context/ToastContext"; // adjust the relative path as needed

// ✅ Load API Base URL from Environment Variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://infinitech-api3.site/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// ✅ Automatically Attach Token to Requests
API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle API Errors Globally
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const event = new CustomEvent("confirmSessionLogout", {
          detail: "Your session has expired. Do you want to log out?",
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);


// ✅ Reusable API Wrapper
export const callAPI = async (method, endpoint, data = null, isFormData = false) => {
  try {
    const config = {
      method,
      url: endpoint,
      ...(method.toLowerCase() === "get" ? {} : { data }),
    };

    if (isFormData) {
      // Let the browser set the proper multipart boundary
      config.headers = { ...config.headers };
      delete config.headers["Content-Type"];
    } else {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

    const res = await API(config);
    return res.data;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
};
// 🔹 ADMIN DASHBOARD ANALYTICS API CALLS
export const fetchDashboardStats = () => callAPI("get", "/admin/dashboard/stats");
export const fetchPropertyTrends = () => callAPI("get", "/admin/dashboard/property-trends");
export const fetchInquiryTrends = () => callAPI("get", "/admin/dashboard/inquiry-trends");
export const fetchJobApplicationTrends = () => callAPI("get", "/admin/dashboard/job-application-trends");
export const fetchWebsiteTraffic = () => callAPI("get", "/admin/dashboard/traffic");

// 🔹 USER AUTH
export const loginUser = async (credentials) => {
  const res = await API.post('/login', credentials);
  localStorage.setItem('jwt', res.data.token);
  localStorage.setItem('loginTimestamp', Date.now());
  return res.data;
};
export const logoutUser = async () => {
  await API.post('/logout');
  localStorage.removeItem('jwt');
};
export const fetchUser = () => callAPI("get", "/user");
export const updateProfile = (data) => callAPI("post", "/user/update-profile", data, true);

// 🔹 APPOINTMENTS
export const getAppointments = () => callAPI("get", "/appointments");
export const updateAppointmentStatus = (id, status) => callAPI("patch", `/admin/appointments/${id}/status`, { status });
export const sendAppointmentMessage = (id, data) => callAPI("post", `/admin/appointments/${id}/message`, data);

// 🔹 USER PROPERTIES (Submission Portal)
export const createProperty = (data) => callAPI("post", "/submit-property", data, true);
export const updateProperty = (id, data) => callAPI("post", `/properties/${id}?_method=PUT`, data, true);


// 🔹 CONTACTS
// 🌐 Public: For Footer or any non-authenticated user
export const getPublicContacts = () => callAPI("get", "/contacts");

// 🔐 Admin: Authenticated view in dashboard
export const getAdminContacts = () => callAPI("get", "/admin/contacts");


export const addContact = (data) => callAPI("post", "/admin/contacts", data);
export const updateContact = (id, data) => callAPI("put", `/admin/contacts/${id}`, data);
export const deleteContact = (id) => callAPI("delete", `/admin/contacts/${id}`);
export const fetchContacts = () => callAPI("get", "/contacts");
// 🔹 INQUIRIES
export const submitInquiry = (data) => callAPI("post", "/inquiries", data);
export const getInquiries = () => callAPI("get", "/admin/inquiries");
export const updateInquiryStatus = (id, status) => callAPI("patch", `/admin/inquiries/${id}/status`, { status });
export const getInquiryWithReplies = (id) => callAPI("get", `/admin/inquiries/${id}`);
export const replyToInquiry = (id, data) => callAPI("post", `/admin/inquiries/${id}/reply`, data);

// 🔹 SERVICES
export const fetchServices = () => callAPI("get", "/services"); // ✅ User-side (only status = 1)
export const getSingleService = (id) => callAPI("get", `/services/${id}`);
export const getAllServices = () => callAPI("get", "/admin/services"); // ✅ Admin-side (all status)
export const createService = (data) => callAPI("post", "/admin/services", data, true);
export const updateService = (id, data) => callAPI("put", `/admin/services/${id}`, data, true);
export const updateServiceStatus = (id, status) => callAPI("patch", `/admin/services/${id}/status`, { status }); // ✅ PATCH status only
export const deleteService = (id) => callAPI("delete", `/admin/services/${id}`);


// 🔹 NEWS
export const getNewsList = () => callAPI("get", "/news");
export const createNews = (data) => callAPI("post", "/news", data, true);
export const updateNews = (id, data) => callAPI("post", `/news/${id}`, data, true);
export const deleteNews = (id) => callAPI("delete", `/news/${id}`);

// 🔹 JOBS
export const getJobs = () => callAPI("get", "/jobs");
export const getPublishedJobs = () => callAPI("get", "/jobs/published");
export const createJob = (data) => callAPI("post", "/jobs", data, true);
export const updateJob = (id, data) => callAPI("post", `/jobs/${id}`, data, true);
export const deleteJob = (id) => callAPI("delete", `/jobs/${id}`);

// 🔹 JOB APPLICATIONS
export const getJobApplications = () => callAPI("get", "/admin/job-applications");
export const updateJobApplicationStatus = (id, status) => callAPI("patch", `/admin/job-applications/${id}/status`, { status });
export const deleteJobApplication = (id) => callAPI("delete", `/admin/job-applications/${id}`);
export const sendJobApplicationReply = (id, data) => callAPI("post", `/admin/job-applications/${id}/reply`, data);
export const submitJobApplication = (data) => callAPI("post", "/job-applications", data, true);

// 🔹 ABOUT US
export const updateAboutDetails = (data) => callAPI("put", "/admin/about-us/update", data);
export const updateAboutStatus = (data) => callAPI("put", "/admin/about-us/update-status", data);
export const updateAboutImages = (data) => callAPI("post", "/admin/about-us/update", data, true);
export const fetchAboutUs = () => callAPI("get", "/admin/about-us");


// 🔹 PROPERTIES
export const getProperties = () => callAPI("get", "/admin/properties");
export const updatePropertyStatus = (id, status) => callAPI("patch", `/admin/property/${id}`, { status });
export const deletePropertyById = (id) =>callAPI("delete", `/admin/property/${id}`);
export const getSingleProperty = (id) => callAPI("get", `/properties/${id}`);
export const getApprovedProperties = () => callAPI("get", "/properties");

export default API;
