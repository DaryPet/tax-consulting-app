// import React, { useState } from "react";
// // import { useDispatch } from "react-redux";
// import { logout } from "../../services/authService";
// import { useNavigate } from "react-router-dom";

// const LogoutButton = () => {
//   // const dispatch = useDispatch();
//   const [logoutInProgress, setLogoutInProgress] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     if (logoutInProgress) return; // Если уже выполняется логаут, ничего не делаем

//     setLogoutInProgress(true); // Устанавливаем флаг, что логаут в процессе
//     try {
//       await logout(); // Выполняем логаут, используя refresh_token из куков
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

import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutInProgress) return; // Если уже выполняется логаут, ничего не делаем

    setLogoutInProgress(true); // Устанавливаем флаг, что логаут в процессе
    try {
      // Отправляем запрос на логаут без передачи токена, полагаясь на refresh_token в куках
      await fetch("https://tax-consulting-app.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include", // Это позволяет отправить куки на сервер
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Логаут успешно выполнен");
      // Перенаправляем пользователя на страницу входа
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выполнении логаута", error);
    } finally {
      setLogoutInProgress(false); // Сбрасываем флаг после завершения операции
    }
  };

  return (
    <button onClick={handleLogout} disabled={logoutInProgress}>
      {logoutInProgress ? "Выход..." : "Выйти"}
    </button>
  );
};

export default LogoutButton;
