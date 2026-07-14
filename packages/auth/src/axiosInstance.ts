import axios from "axios";
import { attachAuthInterceptors } from "./interceptors";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  withCredentials: true,
});

attachAuthInterceptors(authAxios);

export default authAxios;
