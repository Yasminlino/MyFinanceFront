import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

// Instância para endpoints públicos / login
export const apiAccount = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json" },
  timeout: 15000,
});

// Instância “logada”
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// (opcional) interceptor de resposta para tratar 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // por ex.: limpar token e redirecionar para login
      // localStorage.removeItem("authToken");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;