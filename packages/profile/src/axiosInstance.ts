import axios from "axios";
import { attachAuthInterceptors } from "@ecomm/auth";

const profileAxios = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_BASE_URL || "http://localhost:8087",
  withCredentials: true,
});

attachAuthInterceptors(profileAxios);

export default profileAxios;
