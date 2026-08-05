import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("apg_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data or format error
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const hadToken = !!localStorage.getItem("apg_token");
    if (error.response?.status === 401 && !isLoginRequest && hadToken) {
      localStorage.removeItem("apg_token");
      localStorage.removeItem("apg_current_user");
      window.location.reload();
    }

    const customError = {
      success: false,
      message: error.response?.data?.message || error.message || "Terjadi kesalahan koneksi ke server",
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
