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

export const logout = async () => {
  try {
    const response = await axios.post(
      AUTH_LOGOUT_URL,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
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
    const response = await axios.post(
      AUTH_REFRESH_URL,
      {},
      {
        withCredentials: true,
      }
    );

    if (!response.data || !response.data.access_token) {
      throw new Error("Invalid token response");
    }

    const { access_token } = response.data;

    localStorage.setItem("access_token", access_token);
    return response.data;
  } catch (error) {
    localStorage.removeItem("access_token");

    if (axios.isAxiosError(error)) {
      throw new Error(
        `Error request: ${error.response?.status} ${error.response?.statusText}`
      );
    }

    throw new Error("Error while refreshing token");
  }
};

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
    throw new Error("Error fetching user by username");
  }
};
export const deleteUserService = async (id: string) => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    throw new Error("Access token is missing");
  }

  try {
    await axios.delete(USERS_ID_URL(id), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
