import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/operations";
import { AppDispatch } from "../../redux/store";
import styles from "./LogoutButton.module.css";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Начало выполнения операции logout");
      await dispatch(logoutUser()).unwrap();
      console.log("Вы успешно вышли из системы");
      navigate("/login"); // Перенаправление после выхода
    } catch (error) {
      console.error("Ошибка при выполнении logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.button}>
      Logout
    </button>
  );
};

export default LogoutButton;
