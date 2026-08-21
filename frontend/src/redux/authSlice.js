import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5500/api";

/*
|--------------------------------------------------------------------------
| Restore previous login session
|--------------------------------------------------------------------------
*/

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

let userFromStorage = null;

try {
  userFromStorage = storedUser ? JSON.parse(storedUser) : null;
} catch {
  localStorage.removeItem("user");
}

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  user: userFromStorage,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),

  loading: false,
  error: null,
  success: false,
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        userData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        credentials
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| AUTH SLICE
|--------------------------------------------------------------------------
*/

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    /*
    |--------------------------------------------------------------------------
    | SET CREDENTIALS
    |--------------------------------------------------------------------------
    */

    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(token);

      state.error = null;
      state.success = true;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (token) {
        localStorage.setItem("token", token);
      }
    },

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;
      state.success = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    /*
    |--------------------------------------------------------------------------
    | CLEAR ERROR
    |--------------------------------------------------------------------------
    */

    clearAuthError: (state) => {
      state.error = null;
    },

    /*
    |--------------------------------------------------------------------------
    | CLEAR SUCCESS
    |--------------------------------------------------------------------------
    */

    clearAuthSuccess: (state) => {
      state.success = false;
    },
  },

  /*
  |--------------------------------------------------------------------------
  | ASYNC ACTIONS
  |--------------------------------------------------------------------------
  */

  extraReducers: (builder) => {
    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        /*
        Backend returns:

        {
          _id,
          name,
          email,
          role,
          isEmailVerified,
          token,
          message
        }

        Therefore we create the user object ourselves.
        */

        const {
          _id,
          name,
          email,
          role,
          isEmailVerified,
          token,
        } = action.payload;

        const user = {
          _id,
          name,
          email,
          role,
          isEmailVerified,
        };

        state.user = user;

        if (token) {
          state.token = token;
          state.isAuthenticated = true;

          localStorage.setItem("token", token);
        }

        localStorage.setItem("user", JSON.stringify(user));
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Registration failed.";
      });

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        /*
        Backend returns:

        {
          _id,
          name,
          email,
          role,
          isEmailVerified,
          token
        }
        */

        const {
          _id,
          name,
          email,
          role,
          isEmailVerified,
          token,
          avatar,
        } = action.payload;

        const user = {
          _id,
          name,
          email,
          role,
          isEmailVerified,
          avatar,
        };

        state.user = user;

        if (token) {
          state.token = token;
          state.isAuthenticated = true;

          localStorage.setItem("token", token);
        }

        localStorage.setItem("user", JSON.stringify(user));
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Login failed.";
      });
  },
});

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

export const {
  setCredentials,
  logout,
  clearAuthError,
  clearAuthSuccess,
} = authSlice.actions;

/*
|--------------------------------------------------------------------------
| SELECTORS
|--------------------------------------------------------------------------
*/

export const selectUser = (state) => state.auth.user;

export const selectToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state) =>
  state.auth.loading;

export const selectAuthError = (state) =>
  state.auth.error;

/*
|--------------------------------------------------------------------------
| REDUCER
|--------------------------------------------------------------------------
*/

export default authSlice.reducer;