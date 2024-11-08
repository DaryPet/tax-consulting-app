import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, register, logout } from "../../services/authService";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
}
// Типизация состояния авторизаци
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Error messages
const LOGIN_ERROR_MESSAGE = "Error while logging in";
const REGISTER_ERROR_MESSAGE = "Error during registration";
const LOGOUT_ERROR_MESSAGE = "Error while logging out";

// Начальное состояние
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  //   _persist: {
  //     version: -1,
  //     rehydrated: false,
  //   },
};

// Асинхронный экшен для входа
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      console.log("Dispatching login request with username:", username);
      const data = await login(username, password);
      console.log("Server response:", data);
      return data; // Вернем данные пользователя (например, токен и информация о пользователе)
    } catch (error) {
      return thunkAPI.rejectWithValue(LOGIN_ERROR_MESSAGE);
    }
  }
);

// Асинхронный экшен для регистрации
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
      const data = await register(name, username, password);
      return data; // Вернем данные пользователя после успешной регистрации
    } catch (error) {
      return thunkAPI.rejectWithValue(REGISTER_ERROR_MESSAGE);
    }
  }
);

// Асинхронный экшен для выхода
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logout();
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(LOGOUT_ERROR_MESSAGE);
    }
  }
);

// Создание слайса для управления авторизацией
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Логика обработки loginUser экшена
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User }>) => {
          console.log("Login fulfilled, received data:", action.payload);
          state.status = "idle";
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
          toast.success("You have successfully logged in");
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        const errorMessage = (action.payload as string) || LOGIN_ERROR_MESSAGE;

        state.error = errorMessage;
        // Добавляем уведомление об ошибке входа
        console.error("Invalid data received:", action.payload);
        toast.error(errorMessage);
      })
      // Логика обработки registerUser экшена
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ user: User }>) => {
          state.status = "idle";
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.error = null;
          toast.success("You have successfully registered");
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        const errorMessage =
          (action.payload as string) || REGISTER_ERROR_MESSAGE;
        state.error = errorMessage;
        console.error("Register error: ", action.error);
        // Добавляем уведомление об ошибке входа
        toast.error(errorMessage);
      })
      // Логика обработки logoutUser экшена
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        toast.success("You have successfully logged out");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        const errorMessage = (action.payload as string) || LOGOUT_ERROR_MESSAGE;
        state.error = errorMessage;
        console.error("Logout error: ", action.error);
        toast.error(errorMessage);
      });
  },
});

// Экспорт редьюсеров и экшенов
export default authSlice.reducer;
