// src/services/adminService.js

import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAllRecipesAdmin = async (params = {}) => {
  const response = await api.get("/admin/recipes", { params });
  return response.data;
};

export const toggleRecipePublish = async (id) => {
  const response = await api.put(`/admin/recipes/${id}/toggle-publish`);
  return response.data;
};

export const deleteRecipeAdmin = async (id) => {
  const response = await api.delete(`/admin/recipes/${id}`);
  return response.data;
};

export const getAllReviewsAdmin = async (params = {}) => {
  const response = await api.get("/admin/reviews", { params });
  return response.data;
};

export const deleteReviewAdmin = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};