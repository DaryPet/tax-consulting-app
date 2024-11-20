import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  refreshToken,
  getAllUsers,
} from "../services/authService";
import { resetAuthState } from "./slices/authSlice";
import axios from "axios";
import { AUTH_REFRESH_URL } from "../config/apiConfig";
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

      await logout();
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
      console.log(
        "Запуск fetchCurrentUser, с токеном:",
        localStorage.getItem("access_token")
      );
      const response = await fetchUserData();
      return response;
    } catch (error) {
      console.error("Ошибка при вызове fetchCurrentUser:", error);
      return thunkAPI.rejectWithValue("Failed to fetch user data");
    }
  }
);
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// export const refreshUserToken = createAsyncThunk(
//   "auth/refreshUserToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await refreshToken();
//       const { access_token } = response;
//       localStorage.setItem("access_token", access_token);
//       return response;
//     } catch (error) {
//       return rejectWithValue("Error while refreshing token");
//     }
//   }
// );
export const refreshUserToken = createAsyncThunk(
  "auth/refreshUserToken",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Отправка запроса на обновление токена...");
      const response = await axios.post(
        AUTH_REFRESH_URL,
        {},
        { withCredentials: true }
      );

      if (!response.data || !response.data.access_token) {
        throw new Error("Invalid token response");
      }

      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);

      console.log("Токен успешно обновлен:", access_token);
      console.log(
        "Токен после обновления в refreshUserToken:",
        localStorage.getItem("access_token")
      );
      return { access_token }; // Исправлено: возвращаем объект с access_token
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("access_token"); // Удаляем токен только при 401 Unauthorized
      }
      return rejectWithValue("Error while refreshing token");
    }
  }
);
// \\\\\\\\\\\\\\\\\
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
// export const restoreSession = createAsyncThunk(
//   "auth/restoreSession",
//   async (_, { rejectWithValue }) => {
//     try {
//       // Сначала обновляем токен
//       const { access_token } = await refreshToken();
//       localStorage.setItem("access_token", access_token);

//       // Затем загружаем данные пользователя
//       const userData = await fetchUserData();
//       return userData;
//     } catch (error) {
//       console.error("Ошибка восстановления сессии:", error);
//       return rejectWithValue("Failed to restore session");
//     }
//   }
// );
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No token available for restoring session");
      }

      const { access_token } = await refreshToken();
      localStorage.setItem("access_token", access_token);

      const userData = await fetchUserData();
      return userData;
    } catch (error) {
      console.error("Ошибка восстановления сессии:", error);
      localStorage.removeItem("access_token"); // Сброс токена
      return rejectWithValue("Failed to restore session");
    }
  }
);

// export const initializeAuthState = createAsyncThunk(
//   "auth/initializeAuthState",
//   async (_, { dispatch }) => {
//     try {
//       // Попытка восстановления сессии через refreshToken
//       await dispatch(restoreSession());
//     } catch (error) {
//       console.error("Ошибка при восстановлении сессии:", error);
//     }
//   }
// );
export const initializeAuthState = createAsyncThunk(
  "auth/initializeAuthState",
  async (_, { dispatch }) => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("Токен при инициализации:", token);

      if (!token) {
        // Если токена нет, сброс состояния
        dispatch(resetAuthState());
        return;
      }

      // Попытка обновить токен
      const response = await dispatch(refreshUserToken()).unwrap();
      const { access_token } = response;
      console.log("Обновленный токен в initializeAuthState:", access_token);

      localStorage.setItem("access_token", access_token);
      await dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Ошибка восстановления сессии:", error);
      dispatch(resetAuthState());
    }
  }
);
