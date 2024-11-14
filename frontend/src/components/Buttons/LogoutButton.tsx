// import React, { useState } from "react";

// import { useNavigate } from "react-router-dom";

// const LogoutButton = () => {
//   const [logoutInProgress, setLogoutInProgress] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     if (logoutInProgress) return; // Если уже выполняется логаут, ничего не делаем

//     setLogoutInProgress(true); // Устанавливаем флаг, что логаут в процессе
//     try {
//       // Отправляем запрос на логаут без передачи токена, полагаясь на refresh_token в куках
//       await fetch("https://tax-consulting-app.onrender.com/auth/logout", {
//         method: "POST",
//         credentials: "include", // Это позволяет отправить куки на сервер
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Логаут успешно выполнен");
//       // Перенаправляем пользователя на страницу входа
//       navigate("/login");
//     } catch (error) {
//       console.error("Ошибка при выполнении логаута", error);
//     } finally {
//       setLogoutInProgress(false); // Сбрасываем флаг после завершения операции
//     }
//   };

//   return (
//     <button onClick={handleLogout} disabled={logoutInProgress}>
//       {logoutInProgress ? "Выход..." : "Выйти"}
//     </button>
//   );
// };

// export default LogoutButton;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/operations"; // Импортируем асинхронную операцию logoutUser из operations
import { selectIsLoggedIn } from "../../redux/slices/authSlice"; // Используем селектор для получения состояния логина
import { AppDispatch } from "../../redux/store";

const LogoutButton = () => {
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn); // Получаем состояние логина
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutInProgress) return;

    setLogoutInProgress(true);
    try {
      await dispatch(logoutUser()).unwrap(); // Я ИЗМЕНИЛ ЗДЕСЬ: используем `logoutUser()` и `unwrap()`, чтобы обработать ошибки
      console.log("Логаут успешно выполнен");
      navigate("/login"); // Перенаправляем пользователя на страницу логина
    } catch (error) {
      console.error("Ошибка при выполнении логаута", error);
    } finally {
      setLogoutInProgress(false); // Завершаем процесс логаута
    }
  };

  return (
    <button onClick={handleLogout} disabled={logoutInProgress}>
      {isLoggedIn
        ? logoutInProgress
          ? "Выход..."
          : "Выйти"
        : "Войти / Регистрация"}
    </button>
  );
};

export default LogoutButton;
