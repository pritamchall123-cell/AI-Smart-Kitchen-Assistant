// src/services/aiService.js

import api from "./api";

export const generateRecipe = async (data) => {
  const response = await api.post("/ai/generate-recipe", data);
  return response.data;
};

export const chatWithAssistant = async (message, history) => {
  const response = await api.post("/ai/chat", { message, history });
  return response.data;
};

export const detectIngredients = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/ai/detect-ingredients", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};