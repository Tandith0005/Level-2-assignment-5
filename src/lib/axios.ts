import axios from "axios";
import { env } from "../config/env";


const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request Interceptor: Attach Token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && url === '/auth/me') {
      return Promise.reject(error);
    }

    if (status === 401) {
      
    } else {
      console.error('API Error:', status, url);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;