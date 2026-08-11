// src/services/api.js
// A central, pre-configured Axios instance used across the entire app.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // reads from .env, e.g. http://localhost:5500/api
  headers: {
    "Content-Type": "application/json",
  },
});

// An "interceptor" runs automatically before every single request.
// Here, we check if a token is saved in localStorage, and if so,
// automatically attach it to the Authorization header — so we never
// have to manually add it in every single component that calls the API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;