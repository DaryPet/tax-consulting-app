// frontend/src/redux/services/auth.service.ts
import axios from "axios";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_REGISTER_URL,
  AUTH_ME_URL,
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
// Получение текущего пользователя (маршрут `/auth/me`)
export const getCurrentUser = async () => {
  const response = await axios.get(AUTH_ME_URL, {
    withCredentials: true, // Передаем куки
  });
  return response.data; // Возвращаем текущего пользователя
};

// Рефреш данных пользователя по токену (если используется)
export const fetchUserData = async (token: string) => {
  const response = await axios.get(AUTH_ME_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
