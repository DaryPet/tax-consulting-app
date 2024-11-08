import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Страница не найдена</h1>
      <p>К сожалению, страница, которую вы ищете, не существует.</p>
      <Link to="/">Вернуться на главную страницу</Link>
    </div>
  );
};

export default NotFoundPage;
