import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  fetchUserData,
  refreshToken,
  getAllUsers,
  deleteUserService,
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
      const response = await register(name, username, email, password);
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
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Error while logging in");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logout();
      localStorage.removeItem("access_token");
      dispatch(resetAuthState());
      return;
    } catch (error) {
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

export const refreshUserToken = createAsyncThunk(
  "auth/refreshUserToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Access token not found");
      }
      const response = await axios.post(
        AUTH_REFRESH_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!response.data || !response.data.access_token) {
        throw new Error("Invalid token response");
      }

      const { access_token: updatedToken } = response.data;
      localStorage.setItem("access_token", updatedToken);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("access_token");
      }
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
      // console.error("Ошибка восстановления сессии:", error);
      localStorage.removeItem("access_token");
      return rejectWithValue("Failed to restore session");
    }
  }
);

export const initializeAuthState = createAsyncThunk(
  "auth/initializeAuthState",
  async (_, { dispatch }) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        dispatch(resetAuthState());
        return;
      }

      const response = await dispatch(refreshUserToken()).unwrap();
      const { access_token } = response;
      localStorage.setItem("access_token", access_token);
      await dispatch(fetchCurrentUser());
    } catch (error) {
      dispatch(resetAuthState());
    }
  }
);
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, thunkAPI) => {
    try {
      await deleteUserService(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete user");
    }
  }
);
