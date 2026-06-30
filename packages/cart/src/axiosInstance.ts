import axios from "axios";
import { useAuthStore } from "@ecomm/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CART_BASE_API_URL + "cart",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
