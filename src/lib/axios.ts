import axios from "axios";
import { env } from "../config/env";


const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // SILENCE 401s on /auth/me (Expected for logged-out users)
    if (status === 401 && url === '/auth/me') {
      return Promise.reject(error); // Reject silently (no console.log)
    }

    // Handle Global 401 (Token expired during active session)
    if (status === 401) {
      localStorage.removeItem("accessToken");
      // Optional: window.location.href = '/login'; 
    } else {
      // Log ONLY real unexpected errors
      console.error('API Error:', status, url);
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;