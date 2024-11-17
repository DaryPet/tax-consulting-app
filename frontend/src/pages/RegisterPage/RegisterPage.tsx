import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/operations";
import styles from "../FormPage.module.css";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    try {
      const response = await dispatch(
        registerUser({ name, username, email, password })
      ).unwrap();
      console.log("Ответ от сервера:", response);

      if (response.role === "user") {
        navigate("/user-profile");
      } else {
        console.error("Неожиданная роль пользователя:", response.role);
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <div className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={styles.input}
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
        />
        <button
          onClick={handleRegister}
          disabled={status === "loading"}
          className={styles.button}
        >
          {status === "loading" ? "Registering..." : "Register"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
