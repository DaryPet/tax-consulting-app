import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "../../redux/slices/bookingSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { selectAuthToken } from "../../redux/slices/authSlice";
import styles from "./AllBookings.module.css";

const AllBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const loading = useSelector((state: RootState) => state.booking.loading);
  const error = useSelector((state: RootState) => state.booking.error);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllBookings(token));
    }
  }, [dispatch, token]);

  console.log("All bookings from Redux state:", bookings);

  const sortedBookings = Array.from(bookings).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <section className={styles.allBookingsContainer}>
      <h2>All Bookings</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && sortedBookings.length > 0 ? (
        <ul className={styles.bookingsList}>
          {sortedBookings.map((booking) => (
            <li key={booking.id} className={styles.bookingItem}>
              <strong>{booking.name}</strong> - {booking.service} <br />
              Date: {booking.date}, Time: {booking.time}
              <br />
              Email: {booking.email} <br />
              Phone: {booking.phone}
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no bookings</p>
      )}
    </section>
  );
};

export default AllBookings;
