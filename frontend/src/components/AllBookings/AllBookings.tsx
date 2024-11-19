// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllBookings } from "../../redux/slices/bookingSlice";
// import { RootState, AppDispatch } from "../../redux/store";
// import { selectAuthToken } from "../../redux/slices/authSlice";
// import styles from "./AllBookings.module.css";

// const AllBookings: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const token = useSelector(selectAuthToken);
//   const bookings = useSelector((state: RootState) => state.booking.bookings);
//   const loading = useSelector((state: RootState) => state.booking.loading);
//   const error = useSelector((state: RootState) => state.booking.error);

//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchAllBookings(token));
//     }
//   }, [dispatch, token]);
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);
//   const currentBookings = bookings.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   console.log("All bookings from Redux state:", bookings);
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const sortedBookings = Array.from(bookings).sort(
//     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//   );

//   return (
//     <section className={styles.allBookingsContainer}>
//       <h2>All Bookings</h2>
//       {loading && <p>Загрузка...</p>}
//       {error && <p className={styles.error}>Error: {error}</p>}
//       {!loading && sortedBookings.length > 0 ? (
//         <ul className={styles.bookingsList}>
//           {sortedBookings.map((booking) => (
//             <li key={booking.id} className={styles.bookingItem}>
//               <strong>{booking.name}</strong> - {booking.service} <br />
//               Date: {booking.date}, Time: {booking.time}
//               <br />
//               Email: {booking.email} <br />
//               Phone: {booking.phone}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>There are no bookings</p>
//       )}
//     </section>
//   );
// };

// export default AllBookings;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { selectAuthToken } from "../../redux/slices/authSlice";
import styles from "./AllBookings.module.css";
import Loader from "../Loader/Loader";

const AllBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const loading = useSelector((state: RootState) => state.booking.loading);
  const error = useSelector((state: RootState) => state.booking.error);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (token) {
      dispatch(fetchAllBookings(token));
    }
  }, [dispatch, token]);

  // Фильтрация только актуальных букингов
  const today = new Date().setHours(0, 0, 0, 0);
  const validBookings = bookings.filter(
    (booking) => new Date(booking.date).getTime() >= today
  );

  const sortedBookings = Array.from(validBookings).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA === dateB) {
      // Если даты одинаковые, сортируем по времени
      return a.time.localeCompare(b.time);
    }
    return dateA - dateB;
  });

  // Пагинация: общее количество страниц
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  // Букинги для текущей страницы
  const currentBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Обработчики переключения страниц
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Удаление старых букингов
  useEffect(() => {
    validBookings.forEach((booking) => {
      if (new Date(booking.date).getTime() < today) {
        if (token) {
          dispatch(deleteBooking({ bookingId: booking.id, token }));
        }
      }
    });
  }, [validBookings, dispatch, token, today]);

  return (
    <section className={styles.allBookingsContainer}>
      <h2>All Bookings</h2>
      {loading && <Loader />}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && currentBookings.length > 0 ? (
        <ul className={styles.bookingsList}>
          {currentBookings.map((booking) => (
            <li key={booking.id} className={styles.bookingItem}>
              <strong>{booking.name}</strong> - {booking.service} <br />
              Date: {booking.date}, Time: {booking.time}
              <br />
              Email: {booking.email}, Phone: {booking.phone}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>There are no bookings.</p>
      )}

      {/* Пагинация: кнопки переключения страниц */}
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AllBookings;
