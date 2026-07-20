import axios from "axios";
import { attachAuthInterceptors } from "@ecomm/auth";

const ordersAxios = axios.create({
  baseURL: import.meta.env.VITE_ORDERS_BASE_URL || "http://localhost:8086",
  withCredentials: true,
});

attachAuthInterceptors(ordersAxios);

export default ordersAxios;
