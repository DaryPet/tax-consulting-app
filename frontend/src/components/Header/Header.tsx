import React from "react";
import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">FortuneTax Solutions</a>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
