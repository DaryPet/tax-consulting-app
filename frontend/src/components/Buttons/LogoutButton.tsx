import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectAuthToken,
} from "../../redux/slices/authSlice"; // Используем селектор для получения токена и состояния логина
import { AppDispatch } from "../../redux/store";
import { logout } from "../../services/authService"; // Импортируем функцию logout из authService

const LogoutButton = () => {
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn); // Получаем состояние логина
  const token = useSelector(selectAuthToken); // Получаем токен пользователя
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutInProgress || !isLoggedIn) return; // Проверяем, что пользователь авторизован и логаут не идет

    setLogoutInProgress(true);
    try {
      console.log("Отправка запроса на logout...");

      if (!token) {
        throw new Error("Токен отсутствует, невозможно выполнить логаут.");
      }

      await logout();

      dispatch({ type: "auth/logoutUser" });

      console.log("Логаут успешно выполнен");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выполнении логаута", error);
    } finally {
      setLogoutInProgress(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={logoutInProgress}>
      {isLoggedIn
        ? logoutInProgress
          ? "Logging out..."
          : "Logout"
        : "Login / Register"}
    </button>
  );
};

export default LogoutButton;
