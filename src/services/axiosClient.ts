import axios from "axios";

const vite_uri_backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const axiosClient = axios.create({
  baseURL: vite_uri_backend,
  withCredentials: true, // This is important for cookie handling
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login page or handle token expiration
      console.warn("Session expired. Redirecting to login...");
      // Clear local user data if needed
      
      // Optional: Redirect to login
      // window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);