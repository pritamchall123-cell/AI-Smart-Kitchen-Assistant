// src/services/authService.js
// Groups all authentication-related API calls in one place.

import api from "./api";

// Calls POST /api/auth/register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Calls POST /api/auth/login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};