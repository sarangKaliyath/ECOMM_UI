import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  withCredentials: true,
});

export default authAxios;
