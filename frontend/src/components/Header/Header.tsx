import React, { useState } from "react";
import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";
import { FaBars } from "react-icons/fa";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">FortuneTax Solutions</a>
      </div>
      <button className={styles.burger} onClick={toggleNav}>
        <FaBars />
      </button>
      <Navigation isOpen={isNavOpen} toggleNav={toggleNav} />
    </header>
  );
};

export default Header;
