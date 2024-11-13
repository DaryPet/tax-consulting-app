import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.js";

import {
  loginUsers,
  fetchCurrentUser,
  registerUser,
  logoutUser,
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
// Типизация состояния авторизаци
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

// Error messages
// const LOGIN_ERROR_MESSAGE = "Error while logging in";
// const REGISTER_ERROR_MESSAGE = "Error during registration";
// const LOGOUT_ERROR_MESSAGE = "Error while logging out";

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  loading: false,
  status: "idle",
  error: null,
  //   _persist: {
  //     version: -1,
  //     rehydrated: false,
  //   },
};
// Создание слайса для управления авторизацией
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // Логика обработки loginUser экшена
      .addCase(loginUsers.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsers.fulfilled, (state, action) => {
        const { access_token } = action.payload;
        if (!access_token) {
          state.status = "failed";
          state.loading = false;
          state.error = "Invalid response from server during login";
          return;
        }
        state.user = action.payload.user;
        state.token = access_token;
        state.isLoggedIn = true;
        state.loading = false;
        state.status = "succeeded";
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
      // Обработка рефреша пользователя
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
      // Логика обработки registerUser экшена
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { access_token } = action.payload;
        if (!access_token) {
          state.status = "failed";
          state.loading = false;
          state.error = "Invalid response from server during registration";
          return;
        }
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
        // Добавляем уведомление об ошибке входа
        toast.error(errorMessage);
      })
      // Обработка выхода
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
      }),
});

export const selectAuthUser = (state: RootState) => state.auth.user; // Получить объект пользователя
export const selectAuthToken = (state: RootState) => state.auth.token; // Получить токен авторизации
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export default authSlice.reducer;
