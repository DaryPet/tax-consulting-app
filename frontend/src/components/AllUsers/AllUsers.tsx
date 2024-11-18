import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/operations";
import { RootState, AppDispatch } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AllUsers.module.css";
import Loader from "../Loader/Loader";

const AllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllUsers()); // Вызов действия для получения всех пользователей при монтировании компонента
  }, [dispatch]);

  return (
    <section className={styles.allUsersContainer}>
      <h2>All Users</h2>
      {loading && <Loader />}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && users.length > 0 && (
        <ul className={styles.usersList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <p>
                {user.username} - {user.email}
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
      )}
    </section>
  );
};

export default AllUsers;
