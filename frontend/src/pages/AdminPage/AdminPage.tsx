import React from "react";
import styles from "./AdminPage.module.css";
import AllUsers from "../../components/AllUsers/AllUsers"; // Импортируем новый компонент AllUsers
import AllBookings from "../../components/AllBookings/AllBookings";
import AllDocuments from "../../components/AllDocuments/AllDocuments";

const AdminPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Личный Кабинет Admin</h1>
      <section>
        <h2>All clients</h2>
        <AllUsers />{" "}
        {/* Используем компонент AllUsers для отображения списка всех пользователей */}
      </section>
      <section>
        <h2>Все Документы</h2>
        <AllDocuments />
        {/* Здесь нужно будет добавить компонент для отображения всех документов */}
      </section>
      <section>
        <h2>Все Бронирования</h2>
        <AllBookings />
      </section>
    </div>
  );
};

export default AdminPage;
