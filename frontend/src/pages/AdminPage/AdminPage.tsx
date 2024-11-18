import React from "react";
import styles from "./AdminPage.module.css";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <div className={styles.adminPageContainer}>
      <h1>Admin Dashboard</h1>
      <div className={styles.linkSection}>
        <NavLink
          to="users"
          className={({ isActive }) =>
            isActive
              ? `${styles.adminLink} ${styles.activeAdminLink}`
              : styles.adminLink
          }
        >
          Manage Users
        </NavLink>
        <NavLink
          to="bookings"
          className={({ isActive }) =>
            isActive
              ? `${styles.adminLink} ${styles.activeAdminLink}`
              : styles.adminLink
          }
        >
          Manage Bookings
        </NavLink>
        <NavLink
          to="documents"
          className={({ isActive }) =>
            isActive
              ? `${styles.adminLink} ${styles.activeAdminLink}`
              : styles.adminLink
          }
        >
          Manage Documents
        </NavLink>
      </div>
      <div className={styles.outletSection}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
