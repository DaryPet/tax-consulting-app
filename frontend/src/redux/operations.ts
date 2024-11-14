import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  refreshToken,
} from "../services/authService";
import { RootState } from "./store.js";

export const initializeAuthState = createAsyncThunk(
  "auth/initializeAuthState",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        localStorage.removeItem("access_token");
      }
    }
  }
);
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
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log("Начало выполнения операции logout");
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        console.error("Токен отсутствует, невозможно выполнить логаут.");
        return rejectWithValue("No token available");
      }

      console.log("Токен перед logout:", token);

      await logout();
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
    const state: any = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue("No token available");
    }

    try {
      const response = await fetchUserData(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user data");
    }
  }
);
export const refreshUserToken = createAsyncThunk(
  "auth/refreshUserToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log("Начало выполнения операции refresh token");

      const response = await refreshToken();
      console.log("Ответ от сервера на refresh:", response);

      return response;
    } catch (error) {
      console.error("Ошибка при выполнении обновления токена:", error);
      return rejectWithValue("Error while refreshing token");
    }
  }
);
