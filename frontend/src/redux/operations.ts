import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  // getCurrentUser,
} from "../services/authService";

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
export const loginUsers = createAsyncThunk(
  "auth/loginUser",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await login(username, password);
      console.log(response);
      return response; // Ожидаемый ответ: { user, token }
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
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No token available");
    }

    try {
      const response = await fetchUserData(token);
      return response; // Ожидаемый ответ: данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user data");
    }
  }
);
