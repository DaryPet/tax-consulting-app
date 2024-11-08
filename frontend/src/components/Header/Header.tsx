import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul style={{ display: "flex", listStyle: "none", gap: "20px" }}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/contacts">Контакты</Link>
          </li>
          <li>
            <Link to="/login">Войти</Link>
          </li>
          <li>
            <Link to="/register">Регистрация</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
