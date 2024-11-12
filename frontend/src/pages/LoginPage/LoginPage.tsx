import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUsers, fetchCurrentUser } from "../../redux/operations";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
// import { loginUser } from "../redux/slices/authSlice";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, status, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginUsers({ username, password })).unwrap();

      await dispatch(fetchCurrentUser()).unwrap();
      if (user && user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user-profile");
      }
    } catch (err) {
      console.error("Ошибка при логине:", err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
      <div className={styles.form}>
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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
          onClick={handleLogin}
          disabled={status === "loading"}
          className={styles.button}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
