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
      email,
      password,
    }: { name: string; username: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      // \\\\\\\\\\\\\\
      console.log("Данные для регистрации:", {
        name,
        username,
        email,
        password,
      });

      const response = await register(name, username, email, password);
      // \\\\\\\\\\\\\\\\\\\
      console.log("Ответ от сервера:", response);
      return response; // Ожидаемый ответ: { user, token }
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
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      console.log("Начало выполнения операции logout");
      const state: any = thunkAPI.getState();
      const token = state.auth.token; // Получаем токен из состояния

      if (!token) {
        return thunkAPI.rejectWithValue("No token available");
      }

      await logout(token); // Здесь мы не передаем токен, так как теперь передаем куки
      return; // В случае успеха ничего не возвращаем
    } catch (error) {
      console.error("Ошибка при выполнении logout:", error);
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
