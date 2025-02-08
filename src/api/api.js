import axios from "axios";

export const apiAccount = axios.create({
  baseURL: "http://localhost:5034",
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = axios.create({
  baseURL: 'http://localhost:5034',
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
