import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/operations";
import { RootState, AppDispatch } from "../../redux/store";
import { Link } from "react-router-dom";
import styles from "./AllUsers.module.css";
import Loader from "../Loader/Loader";

const AllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [searchTerm, setSearchTerm] = useState<string>(""); // Состояние для хранения поискового термина
  const [currentPage, setCurrentPage] = useState<number>(1); // Состояние для текущей страницы
  const usersPerPage = 10; // Количество пользователей на страницу

  // Запрос на получение всех пользователей при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Фильтрация пользователей на основе поискового термина
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Пагинация - вычисляем индексы для текущей страницы
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Обработчик изменения поискового термина
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
  };

  // Обработчик перехода на предыдущую страницу
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Обработчик перехода на следующую страницу
  const handleNextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={styles.allUsersContainer}>
      <h2>All Users</h2>

      {/* Поле для поиска пользователей по имени */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by username"
        className={styles.searchInput}
      />

      {loading && <Loader />}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && currentUsers.length > 0 && (
        <>
          <ul className={styles.usersList}>
            {currentUsers.map((user) => (
              <li key={user.id} className={styles.userItem}>
                <p>
                  {user.name} - {user.email}
                </p>
                <div className={styles.actions}>
                  {/* Ссылка на документы пользователя */}
                  <Link
                    to={`/admin/users/${user.id}/documents`}
                    className={styles.link}
                  >
                    View Documents
                  </Link>
                  {/* Ссылка на бронирования пользователя */}
                  <Link
                    to={`/admin/users/${user.id}/bookings`}
                    className={styles.link}
                  >
                    View Bookings
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Кнопки для пагинации */}
          <div className={styles.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of{" "}
              {Math.ceil(filteredUsers.length / usersPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={indexOfLastUser >= filteredUsers.length}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}

      {!loading && filteredUsers.length === 0 && (
        <p>No users found matching "{searchTerm}"</p>
      )}
    </section>
  );
};

export default AllUsers;
