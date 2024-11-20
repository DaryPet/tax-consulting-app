import axios from "axios";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_REGISTER_URL,
  AUTH_ME_URL,
  AUTH_REFRESH_URL,
  USERS_URL,
  USERS_ID_URL,
} from "../config/apiConfig";

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
  return response.data;
};

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
  const { access_token } = response.data;

  localStorage.setItem("access_token", access_token);
  return response.data;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\
export const logout = async () => {
  try {
    console.log("Отправка запроса на logout...");

    const response = await axios.post(
      AUTH_LOGOUT_URL,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 204) {
      console.log("Логаут успешно выполнен");
      return response.data;
    } else {
      throw new Error(`Ошибка при логауте: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка при выполнении логаута:", error);
    throw error;
  }
};

// \\\\\\\\\\\\\\\
export const getCurrentUser = async () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    throw new Error("Access token is missing");
  }

  const response = await axios.get(AUTH_ME_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  return response.data;
};
// \\\\\\\\\\\
export const fetchUserData = async () => {
  const access_token = localStorage.getItem("access_token");
  console.log("Токен перед отправкой запроса fetchUserData:", access_token);

  if (!access_token) {
    throw new Error("Access token is missing");
  }
  const response = await axios.get(AUTH_ME_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  console.log("Ответ от /auth/me:", response.data);
  return response.data;
};
// \\\\\\\\\\\\\\\\\\\
export const refreshToken = async () => {
  try {
    console.log("Отправка запроса на обновление токена...");

    const response = await axios.post(
      AUTH_REFRESH_URL,
      {}, // Если требуется, добавьте body
      {
        withCredentials: true, // Если сервер поддерживает
      }
    );

    // Проверка структуры ответа
    if (!response.data || !response.data.access_token) {
      console.error(
        "Некорректный ответ сервера при обновлении токена:",
        response.data
      );
      throw new Error("Invalid token response");
    }

    const { access_token } = response.data;

    // Сохранение токена с обработкой ошибок
    try {
      localStorage.setItem("access_token", access_token);
    } catch (e) {
      console.error("Ошибка при сохранении токена в localStorage:", e);
      throw new Error("Failed to save token");
    }

    console.log("Токен успешно обновлен:", access_token);
    return response.data;
  } catch (error) {
    // Удаление токена при ошибке
    localStorage.removeItem("access_token");
    console.error("Ошибка при обновлении токена:", error);

    // Генерация читабельного сообщения
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Ошибка запроса: ${error.response?.status} ${error.response?.statusText}`
      );
    }

    throw new Error("Error while refreshing token");
  }
};

// \\\\\\\\\\\\\\\\\\\\\\\\
export const getAllUsers = async () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    throw new Error("Access token is missing");
  }
  const response = await axios.get(USERS_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  return response.data;
};
export const getUserById = async (id: string) => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    throw new Error("Access token is missing");
  }

  const response = await axios.get(USERS_ID_URL(id), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
// \\\\\\\\\\\\\\\\\\\\\\\\
export const fetchUserByName = async (
  name: string,
  token: string
): Promise<{ id: number; name: string } | null> => {
  try {
    const response = await fetch(`${USERS_URL}?name=${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user by username");
    }

    const users = await response.json();
    if (users.length === 0) {
      return null;
    }
    const user = users.find((user: any) => user.name === name);
    if (user) {
      return { id: user.id, name: user.name };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Error fetching user by username");
  }
};
// axios.interceptors.response.use(
//   (response) => response, // Пропускаем успешные запросы
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) {
//           throw new Error("Access token missing. Cannot retry request.");
//         }

//         const { access_token } = await refreshToken();
//         localStorage.setItem("access_token", access_token);

//         originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
//         return axios.request(originalRequest);
//       } catch (err) {
//         console.error("Ошибка при обновлении токена:", err);
//         localStorage.removeItem("access_token"); // Удаляем токен при ошибке
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
