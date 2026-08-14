// src/services/pantryService.js

import api from "./api";

export const getPantryItems = async () => {
  const response = await api.get("/pantry");
  return response.data;
};

export const addPantryItem = async (itemData) => {
  const response = await api.post("/pantry", itemData);
  return response.data;
};

export const updatePantryItem = async (id, itemData) => {
  const response = await api.put(`/pantry/${id}`, itemData);
  return response.data;
};

export const deletePantryItem = async (id) => {
  const response = await api.delete(`/pantry/${id}`);
  return response.data;
};

export const getPantryAlerts = async () => {
  const response = await api.get("/pantry/alerts");
  return response.data;
};