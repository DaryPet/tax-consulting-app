// // frontend/src/components/LogoutButton/LogoutButton.tsx
// import React from "react";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../redux/operations";
// import { AppDispatch } from "../../redux/store";
// import styles from "./LogoutButton.module.css";

// const LogoutButton: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   //   const handleLogout = () => {
//   //     dispatch(logoutUser());
//   //   };
//   const handleLogout = async () => {
//     const token = state.auth.token;
//     if (!token) {
//       console.error("Ошибка: отсутствует токен для выхода из системы");
//       return;
//     }

//     try {
//       console.log("Начало выполнения операции logout с токеном:", token);
//       await dispatch(logoutUser()).unwrap();
//       console.log("Вы успешно вышли из системы");
//     } catch (error) {
//       console.error("Ошибка при выполнении logout:", error);
//     }
//   };

//   return (
//     <button onClick={handleLogout} className={styles.button}>
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;
// frontend/src/components/LogoutButton/LogoutButton.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/operations";
import { AppDispatch, RootState } from "../../redux/store";
import styles from "./LogoutButton.module.css";

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Используем useSelector для получения токена из глобального состояния Redux
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = async () => {
    if (!token) {
      console.error("Ошибка: отсутствует токен для выхода из системы");
      return;
    }

    try {
      console.log("Начало выполнения операции logout с токеном:", token);
      // Отправляем экшен logoutUser
      await dispatch(logoutUser()).unwrap();
      console.log("Вы успешно вышли из системы");
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
