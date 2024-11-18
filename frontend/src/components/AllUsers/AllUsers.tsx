import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/operations";
import { RootState, AppDispatch } from "../../redux/store";
import styles from "./AllUsers.module.css";

const AllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    dispatch(fetchAllUsers()); // Вызов действия для получения всех пользователей при монтировании компонента
  }, [dispatch]);

  return (
    <section className={styles.allUsersContainer}>
      <h2>Список Всех Пользователей</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p className={styles.error}>Ошибка: {error}</p>}
      {!loading && users.length > 0 && (
        <ul className={styles.usersList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AllUsers;
