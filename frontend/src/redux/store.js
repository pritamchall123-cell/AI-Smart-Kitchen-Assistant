// src/redux/store.js
// The central Redux store — combines all "slices" of state into one place.

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // As we build more features (pantry, mealPlan, etc.), we'll add more slices here
  },
});