// src/services/communityService.js

import api from "./api";

export const toggleFollow = async (userId) => {
  const response = await api.post(`/community/follow/${userId}`);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/community/profile/${userId}`);
  return response.data;
};

export const getFeed = async () => {
  const response = await api.get("/community/feed");
  return response.data;
};

export const getUserBadges = async (userId) => {
  const response = await api.get(`/community/badges/${userId}`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get("/community/leaderboard");
  return response.data;
};