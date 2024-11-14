import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LogoutButton from "../Buttons/LogoutButton";
import styles from "./Navigation.module.css";

const Navigation: React.FC = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (targetId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { targetId } });
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <button onClick={() => handleScroll("about")} className={styles.link}>
            About
          </button>
        </li>
        <li className={styles.navItem}>
          <button
            onClick={() => handleScroll("services")}
            className={styles.link}
          >
            Services
          </button>
        </li>
        <li className={styles.navItem}>
          <button onClick={() => handleScroll("team")} className={styles.link}>
            Our Team
          </button>
        </li>
        <li className={styles.navItem}>
          <button
            onClick={() => handleScroll("testimonials")}
            className={styles.link}
          >
            Testimonials
          </button>
        </li>
        <li className={styles.navItem}>
          <Link to="/booking" className={styles.link}>
            Booking
          </Link>
        </li>
        {!isLoggedIn && (
          <>
            <li className={styles.navItem}>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/register" className={styles.link}>
                Register
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && user?.role === "admin" && (
          <li className={styles.navItem}>
            <Link to="/admin" className={styles.link}>
              Admin Dashboard
            </Link>
          </li>
        )}
        {isLoggedIn && user?.role === "user" && (
          <li className={styles.navItem}>
            <Link to="/user-profile" className={styles.link}>
              My Room
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li className={styles.navItem}>
            <LogoutButton />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
