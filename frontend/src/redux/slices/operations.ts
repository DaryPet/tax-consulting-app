import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  getCurrentUser,
} from "../../services/authService";

// Асинхронная операция для регистрации пользователя
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      name,
      username,
      password,
    }: { name: string; username: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await register(name, username, password);
      return response.data; // Ожидаемый ответ: { user, token }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error during registration");
    }
  }
);

// Асинхронная операция для логина пользователя
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await login(username, password);
      return response.data; // Ожидаемый ответ: { user, token }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error while logging in");
    }
  }
);

// Асинхронная операция для выхода пользователя
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logout();
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error while logging out");
    }
  }
);

// Асинхронная операция для обновления пользователя
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    if (token === null) {
      return thunkAPI.rejectWithValue("No token available");
    }

    try {
      const response = await fetchUserData(token);
      return response.data; // Ожидаемый ответ: данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to refresh user");
    }
  }
);
// Асинхронная операция для получения текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await getCurrentUser();
      return response; // Ожидаемый ответ: данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch current user");
    }
  }
);
