import axios from "axios";
import { useAuthStore } from "@ecomm/auth";

const profileAxios = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_BASE_URL || "http://localhost:8087",
  withCredentials: true,
});

profileAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default profileAxios;
