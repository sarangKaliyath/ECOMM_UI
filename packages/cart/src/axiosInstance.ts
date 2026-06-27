import axios from "axios";

// Resolved at build time by the consuming app's Vite — never read from packages/cart/.env.*
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CART_BASE_API_URL,
});

export default axiosInstance;
