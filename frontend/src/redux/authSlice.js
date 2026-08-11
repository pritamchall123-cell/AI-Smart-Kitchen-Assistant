// src/redux/authSlice.js
// Manages authentication state: who's logged in, and login/logout actions.

import { createSlice } from "@reduxjs/toolkit";

// On app startup, check if a user was already logged in from a previous session
// by reading directly from localStorage — this way, refreshing the page doesn't log you out.
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const tokenFromStorage = localStorage.getItem("token") || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage, // !! converts a value to a true/false boolean
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after successful login or register
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Keep localStorage in sync, so refreshing the page still remembers the login
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    // Called on logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

// Export the actions so components can trigger them
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer so the store can use it
export default authSlice.reducer;