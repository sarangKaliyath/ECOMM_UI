import axios from "axios";
import { attachAuthInterceptors } from "@ecomm/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CART_BASE_API_URL + "cart",
  withCredentials: true,
});

attachAuthInterceptors(axiosInstance);

export default axiosInstance;
