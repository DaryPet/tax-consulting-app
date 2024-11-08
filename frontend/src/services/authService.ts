// frontend/src/redux/services/auth.service.ts
import axios from "axios";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_REGISTER_URL,
} from "../config/apiConfig";

// Регистрация пользователя
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(AUTH_REGISTER_URL, {
    name,
    email,
    password,
  });
  return response.data;
};

// Вход пользователя в систему
export const login = async (username: string, password: string) => {
  const response = await axios.post(AUTH_LOGIN_URL, {
    username,
    password,
  });
  return response.data;
};

// Выход пользователя из системы
export const logout = async () => {
  const response = await axios.post(AUTH_LOGOUT_URL);
  return response.data;
};
