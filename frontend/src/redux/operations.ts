import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  refreshToken,
  getAllUsers,
} from "../services/authService";
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
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error during registration");
    }
  }
);

export const loginUsers = createAsyncThunk(
  "auth/loginUser",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await login(username, password);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error while logging in");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Начало выполнения операции logout");

      await logout(); // Вызываем функцию logout из authService для выполнения API-запроса

      // Локально очищаем токен из LocalStorage
      localStorage.removeItem("access_token");

      console.log("Логаут завершен");
      return;
    } catch (error) {
      console.error("Ошибка при выполнении logout:", error);
      return rejectWithValue("Error while logging out");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await fetchUserData();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user data");
    }
  }
);
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const refreshUserToken = createAsyncThunk(
  "auth/refreshUserToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue("Error while refreshing token");
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await getAllUsers();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch users data");
    }
  }
);
