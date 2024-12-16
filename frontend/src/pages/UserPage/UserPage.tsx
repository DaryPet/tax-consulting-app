import React, { useEffect } from "react";
import styles from "./UserPage.module.css";
import { NavLink, Outlet } from "react-router-dom";

const UserPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.linkSection}>
        <NavLink
          to="document"
          className={({ isActive }) =>
            isActive
              ? `${styles.userLink} ${styles.activeUserLink}`
              : styles.userLink
          }
        >
          My Documents
        </NavLink>
        <NavLink
          to="booking"
          className={({ isActive }) =>
            isActive
              ? `${styles.userLink} ${styles.activeUserLink}`
              : styles.userLink
          }
        >
          Book Consultation
        </NavLink>
        <div className={styles.outletSection}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
