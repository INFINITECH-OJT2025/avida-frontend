import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const fetchUser = async () => {
  const token = localStorage.getItem('jwt'); // Retrieve token from localStorage
  if (!token) {
    throw new Error("No token found!");
  }

  try {
    const res = await API.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Fetch user error:', error.response?.data || error.message);
    throw error;
  }
};
