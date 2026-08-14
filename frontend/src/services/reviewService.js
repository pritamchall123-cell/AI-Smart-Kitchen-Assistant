// src/services/reviewService.js

import api from "./api";

export const getReviewsForRecipe = async (recipeId) => {
  const response = await api.get(`/reviews/${recipeId}`);
  return response.data;
};

export const createReview = async (recipeId, reviewData) => {
  const response = await api.post(`/reviews/${recipeId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};