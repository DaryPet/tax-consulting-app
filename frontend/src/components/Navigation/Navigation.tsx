// frontend/src/components/Navigation/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LogoutButton from "../Buttons/LogoutButton";
import styles from "./Navigation.module.css";

const Navigation: React.FC = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>
        Home
      </Link>
      <Link to="/services" className={styles.link}>
        Services
      </Link>
      {!isLoggedIn && (
        <>
          <Link to="/login" className={styles.link}>
            Login
          </Link>
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </>
      )}
      {isLoggedIn && user?.role === "admin" && (
        <Link to="/admin" className={styles.link}>
          Admin Dashboard
        </Link>
      )}
      {isLoggedIn && <LogoutButton />}
    </nav>
  );
};

export default Navigation;
