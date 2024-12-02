import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.js";

import {
  loginUsers,
  fetchCurrentUser,
  registerUser,
  logoutUser,
  refreshUserToken,
  fetchAllUsers,
  initializeAuthState,
} from "../operations";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  loading: false,
  status: "idle",
  users: [],
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(initializeAuthState.pending, (state) => {
        state.status = "loading";
        state.isRefreshing = true;
      })
      .addCase(initializeAuthState.fulfilled, (state) => {
        state.status = "succeeded";
        state.isRefreshing = false;
      })
      .addCase(initializeAuthState.rejected, (state, action) => {
        state.status = "failed";
        state.isRefreshing = false;
        state.error = action.payload as string;
      })
      .addCase(loginUsers.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsers.fulfilled, (state, action) => {
        const { access_token, user } = action.payload;
        state.user = user;
        state.token = access_token;
        state.isLoggedIn = true;
        state.loading = false;
        state.status = "succeeded";
        localStorage.setItem("access_token", access_token);
        toast.success("You have successfully logged in");
      })
      .addCase(loginUsers.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        // \\\\\\\\\\\\\\\\\\\\
        console.error("Invalid data received:", action.payload);
        toast.error(errorMessage);
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isRefreshing = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { access_token } = action.payload;
        state.user = action.payload.user;
        state.token = access_token;
        state.isLoggedIn = true;
        state.loading = false;
        state.status = "succeeded";
        toast.success("You have successfully registered");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        console.error("Register error: ", action.error);
        toast.error(errorMessage);
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        const { access_token } = action.payload;
        state.token = access_token;
        state.isLoggedIn = true;
        state.loading = false;
        state.status = "succeeded";
        localStorage.setItem("access_token", access_token);
        console.log("Token successfully refreshed");
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.user = null;
        state.error = action.payload as string;
        console.error("Refresh token error: ", action.error);
        toast.error("Session expired. Please log in again.");
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.status = "succeeded";
        state.error = null;
        localStorage.removeItem("access_token");
        toast.success("You have successfully logged out");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;
        // \\\\\\\\\\\\\\\\\\\\\
        console.error("Logout error: ", action.error);
        toast.error(errorMessage);
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.sort((a: User, b: User) =>
          a.username.localeCompare(b.username)
        );
        state.status = "succeeded";
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = "failed";
      }),
});

export const { resetAuthState } = authSlice.actions;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export default authSlice.reducer;
