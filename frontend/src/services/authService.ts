import axios from "axios";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_REGISTER_URL,
  AUTH_ME_URL,
  AUTH_REFRESH_URL,
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
// export const logout = async () => {
//   console.log("Отправка запроса на logout...");

//   const response = await axios.post(
//     AUTH_LOGOUT_URL,
//     {},
//     {
//       withCredentials: true,
//     }
//   );
//   return response.data;
// };
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

export const refreshToken = async () => {
  try {
    console.log("Отправка запроса на обновление токена...");

    const response = await axios.post(
      AUTH_REFRESH_URL,
      {},
      {
        withCredentials: true,
      }
    );
    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);

    console.log("Ответ от сервера на обновление токена:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    throw new Error("Error while refreshing token");
  }
};
// export const authenticatedRequest = async (url: string, options: any) => {
//   try {
//     const access_token = localStorage.getItem("access_token");
//     if (!access_token) {
//       throw new Error("Access token is missing");
//     }

//     const response = await axios(url, {
//       ...options,
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         ...options.headers,
//       },
//       withCredentials: true,
//     });

//     return response.data;
//   } catch (error: any) {
//     if (error.response && error.response.status === 401) {
//       try {
//         const newToken = await refreshToken();
//         const response = await axios(url, {
//           ...options,
//           headers: {
//             Authorization: `Bearer ${newToken}`,
//             ...options.headers,
//           },
//           withCredentials: true,
//         });
//         return response.data;
//       } catch (refreshError) {
//         throw refreshError;
//       }
//     } else {
//       throw error;
//     }
//   }
// };
