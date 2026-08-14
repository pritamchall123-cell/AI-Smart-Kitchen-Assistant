// src/services/mealService.js

import api from "./api";

export const getMealPlan = async (startDate, endDate) => {
  const response = await api.get("/meals", { params: { startDate, endDate } });
  return response.data;
};

export const addMealPlanEntry = async (entryData) => {
  const response = await api.post("/meals", entryData);
  return response.data;
};

export const deleteMealPlanEntry = async (id) => {
  const response = await api.delete(`/meals/${id}`);
  return response.data;
};