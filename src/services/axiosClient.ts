import axios from "axios";

const vite_uri_backend = import.meta.env.VITE_BACKEND_URL;

export const axiosClient = axios.create({
  baseURL: vite_uri_backend,
});
