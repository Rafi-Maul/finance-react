import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

// The response interceptor below unwraps `response.data`, so callers receive
// the payload directly rather than an AxiosResponse. This interface reflects
// that runtime shape instead of axios's default (Promise<AxiosResponse<T>>).
interface ApiClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  status?: number;
  errors?: unknown;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token if available
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("apg_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: Extract data or format error
instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const hadToken = !!localStorage.getItem("apg_token");
    if (error.response?.status === 401 && !isLoginRequest && hadToken) {
      localStorage.removeItem("apg_token");
      localStorage.removeItem("apg_current_user");
      window.location.reload();
    }

    const customError: ApiErrorShape = {
      success: false,
      message: error.response?.data?.message || error.message || "Terjadi kesalahan koneksi ke server",
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

const apiClient = instance as unknown as ApiClient;

export default apiClient;
