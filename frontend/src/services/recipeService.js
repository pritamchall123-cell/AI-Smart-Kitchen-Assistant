// src/services/recipeService.js
// Groups all recipe-related API calls.

import api from "./api";

// Calls GET /api/recipes with optional query params, e.g. { page: 1, limit: 12, cuisine: "Indian" }
export const getRecipes = async (params = {}) => {
  const response = await api.get("/recipes", { params });
  return response.data;
};

// Calls GET /api/recipes/:id
export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};