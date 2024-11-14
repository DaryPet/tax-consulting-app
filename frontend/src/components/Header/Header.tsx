// frontend/src/components/Header/Header.tsx
import React from "react";
import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    // <div className={styles.headerContainer}>
    //   <header className={styles.header}>
    //     <Navigation />
    //   </header>
    // </div>
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">FortuneTax Solutions</a> {/* Логотип */}
      </div>
      <Navigation /> {/* Навигация */}
    </header>
  );
};

export default Header;
