import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8085', // Your API Gateway URL
});

// ✅ Request Interceptor to attach Bearer Token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  const tokenExpiry = localStorage.getItem('tokenExpiry'); // Optional: Token expiry time
  
  if (token && (!tokenExpiry || new Date().getTime() < tokenExpiry)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (tokenExpiry && new Date().getTime() >= tokenExpiry) {
    // Token expired, clear storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = "/login";
  }
  return config;
});

// ✅ Response Interceptor to handle 401/403 errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401 || error.response.status === 403) {
        window.location.href = "/login"; // Redirect to login if unauthorized
      } else if (error.response.status === 500) {
        console.error('Server error:', error.response.data || error.message);
        alert('Server error. Please try again later.');
      }
    } else {
      console.error('Network error:', error.message);
      alert('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default instance;