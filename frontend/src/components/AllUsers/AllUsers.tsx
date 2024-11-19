import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/operations";
import { RootState, AppDispatch } from "../../redux/store";
import styles from "./AllUsers.module.css";
import Loader from "../Loader/Loader";

const AllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={styles.allUsersContainer}>
      <h2>All Users</h2>
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
                  <span className={styles.userName}>{user.name}</span> -
                  {user.email}
                </p>
              </li>
            ))}
          </ul>
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
