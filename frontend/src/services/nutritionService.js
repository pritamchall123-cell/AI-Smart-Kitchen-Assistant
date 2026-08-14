// src/services/nutritionService.js

import api from "./api";

export const getNutritionReport = async (startDate, endDate) => {
  const response = await api.get("/nutrition", { params: { startDate, endDate } });
  return response.data;
};