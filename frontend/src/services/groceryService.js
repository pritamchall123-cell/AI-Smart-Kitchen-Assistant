// src/services/groceryService.js

import api from "./api";

export const getGroceryList = async () => {
  const response = await api.get("/grocery");
  return response.data;
};

export const addGroceryItem = async (itemData) => {
  const response = await api.post("/grocery", itemData);
  return response.data;
};

export const toggleItemPurchased = async (itemId) => {
  const response = await api.put(`/grocery/${itemId}/toggle`);
  return response.data;
};

export const deleteGroceryItem = async (itemId) => {
  const response = await api.delete(`/grocery/${itemId}`);
  return response.data;
};

export const clearPurchasedItems = async () => {
  const response = await api.delete("/grocery/clear-purchased");
  return response.data;
};

export const autoGenerateGroceryList = async () => {
  const response = await api.post("/grocery/auto-generate");
  return response.data;
};