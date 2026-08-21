// src/services/recipeService.js
// Groups all recipe-related API calls.

import api from "./api";

// Creates a recipe with optional image files, using multipart/form-data
export const createRecipe = async (recipeData, imageFiles) => {
  const formData = new FormData();

  formData.append("title", recipeData.title);
  formData.append("description", recipeData.description);
  formData.append("ingredients", JSON.stringify(recipeData.ingredients));
  formData.append("instructions", JSON.stringify(recipeData.instructions));
  formData.append("cuisine", recipeData.cuisine || "");
  formData.append("mealType", recipeData.mealType || "");
  formData.append("dietType", JSON.stringify(recipeData.dietType || []));
  formData.append("difficulty", recipeData.difficulty || "medium");
  formData.append("prepTime", recipeData.prepTime);
  formData.append("cookTime", recipeData.cookTime);
  formData.append("servings", recipeData.servings);
  formData.append("nutrition", JSON.stringify(recipeData.nutrition || {}));
  formData.append("budget", recipeData.budget || "medium");
  formData.append("tags", JSON.stringify(recipeData.tags || []));

  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  const response = await api.post("/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

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