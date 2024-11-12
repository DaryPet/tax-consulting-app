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
  username: string,
  email: string,
  password: string
) => {
  const response = await axios.post(
    AUTH_REGISTER_URL,
    {
      name,
      email,
      password,
      username,
    },
    { withCredentials: true }
  );
  return response.data; // Ожидаемый ответ: { user, token }
};

// Вход пользователя в систему
export const login = async (username: string, password: string) => {
  const response = await axios.post(
    AUTH_LOGIN_URL,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data; // Ожидаемый ответ: { user, token }
};

export const logout = async (token: string) => {
  try {
    console.log("Отправка запроса на logout...");
    const response = await axios.post(
      AUTH_LOGOUT_URL,
      {},
      {
        withCredentials: true,
        // headers: {
        //   Authorization: `Bearer ${token}`, // Передаем токен в заголовке
        // },
      }
    );
    console.log("Успешный logout:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при выполнении logout:", error);

    throw error;
  }
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
    withCredentials: true,
  });
  return response.data;
};
