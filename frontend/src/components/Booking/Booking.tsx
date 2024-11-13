// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import styles from "./Booking.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "../../redux/store";
// import {
//   fetchAvailableSlots,
//   createBooking,
//   selectAvailableSlots,
//   selectBookingLoading,
//   selectBookingError,
//   selectBookingSuccess,
//   clearMessages,
// } from "../../redux/slices/bookingSlice";
// import {
//   selectAuthToken,
//   selectIsLoggedIn,
// } from "../../redux/slices/authSlice";

// // Интерфейс для пропсов компонента Booking
// interface BookingProps {
//   prefillData?: {
//     name?: string;
//     email?: string;
//     phone?: string;
//   };
// }

// const Booking: React.FC<BookingProps> = ({ prefillData }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Получаем данные пользователя и статус из authSlice
//   const token = useSelector(selectAuthToken);
//   const isLoggedIn = useSelector(selectIsLoggedIn);

//   // Состояния для формы и слотов
//   const [date, setDate] = useState<Date | null>(new Date());
//   const [selectedTime, setSelectedTime] = useState<string | undefined>(
//     undefined
//   );
//   const [name, setName] = useState<string>(prefillData?.name || "");
//   const [email, setEmail] = useState<string>(prefillData?.email || "");
//   const [phone, setPhone] = useState<string>(prefillData?.phone || "");

//   // Получаем доступные временные слоты из Redux
//   const availableSlots = useSelector(selectAvailableSlots);
//   const loading = useSelector(selectBookingLoading);
//   const error = useSelector(selectBookingError);
//   const successMessage = useSelector(selectBookingSuccess);

//   // Запрашиваем доступные слоты при изменении даты
//   useEffect(() => {
//     if (date) {
//       dispatch(fetchAvailableSlots(date.toISOString().split("T")[0]));
//     }
//   }, [date, dispatch]);

//   // Обработка сообщений об успешном бронировании или ошибках
//   useEffect(() => {
//     if (error) {
//       alert(error);
//       dispatch(clearMessages());
//     }
//   }, [error, dispatch]);

//   // Обработчик выбора времени
//   const handleTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTime(event.target.value);
//   };

//   // Обработчик отправки формы бронирования
//   const handleBooking = (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!date || !selectedTime) {
//       console.error("Необходимо выбрать дату и время.");
//       return;
//     }

//     // Проверка на заполнение всех полей
//     if (!name || !email || !phone) {
//       alert("Все поля должны быть заполнены.");
//       return;
//     }

//     // Создаем данные бронирования
//     const bookingData = {
//       name,
//       email,
//       phone,
//       service: "General Consultation",
//       date: date.toISOString().split("T")[0],
//       time: selectedTime,
//     };

//     // Разделяем логику для авторизованных и неавторизованных пользователей
//     if (isLoggedIn && token) {
//       // Для авторизованного пользователя отправляем данные с токеном
//       dispatch(
//         createBooking({
//           ...bookingData,
//           token,
//         })
//       );
//     } else {
//       // Для неавторизованного пользователя отправляем только базовые данные бронирования
//       dispatch(createBooking(bookingData));
//     }
//   };

//   return (
//     <>
//       <div className={styles.bookingSection}>
//         <h2>Book a Consultation</h2>
//         <form className={styles.bookingForm} onSubmit={handleBooking}>
//           <div className={styles.inputGroup}>
//             <label htmlFor="name">Name:</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label htmlFor="phone">Phone:</label>
//             <input
//               type="tel"
//               id="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//               disabled={!!prefillData?.phone && prefillData.phone !== ""}
//             />
//           </div>

//           <div className={styles.calendarContainer}>
//             <Calendar
//               onChange={(value) => {
//                 if (value && !Array.isArray(value)) {
//                   setDate(value);
//                 } else {
//                   setDate(null);
//                 }
//               }}
//               value={date}
//               selectRange={false}
//               tileDisabled={({ date }) => {
//                 const day = date.getDay();
//                 return day === 0 || day === 6; // 0 - Воскресенье, 6 - Суббота
//               }}
//             />
//           </div>

//           {date && (
//             <div className={styles.timeSelection}>
//               <h3>Choose Time:</h3>
//               <select onChange={handleTimeSelect} value={selectedTime || ""}>
//                 <option value="" disabled>
//                   Choose time
//                 </option>
//                 {availableSlots.length > 0 ? (
//                   availableSlots.map((slot) => (
//                     <option key={slot} value={slot}>
//                       {slot}
//                     </option>
//                   ))
//                 ) : (
//                   <option value="" disabled>
//                     No available time slots
//                   </option>
//                 )}
//               </select>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={!selectedTime || loading}
//             className={styles.bookButton}
//           >
//             {loading ? "Booking..." : "Book Now"}
//           </button>
//         </form>

//         {successMessage && (
//           <div className={styles.successMessage}>
//             <h3>Booking Successful!</h3>
//             <p>
//               Thank you, <strong>{name}</strong>!
//               <br />
//               You have successfully booked a consultation on{" "}
//               <strong>{date?.toISOString().split("T")[0]}</strong> at{" "}
//               <strong>{selectedTime}</strong>.
//               <br />
//               We will contact you shortly at <strong>{phone}</strong>.
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Booking;
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./Booking.module.css";
import {
  fetchAvailableSlots,
  createBooking,
  selectAvailableSlots,
  selectBookingLoading,
  selectBookingError,
  selectBookingSuccess,
  clearMessages,
} from "../../redux/slices/bookingSlice";
import {
  selectAuthToken,
  selectIsLoggedIn,
} from "../../redux/slices/authSlice";

// Интерфейс для пропсов компонента Booking
interface BookingProps {
  prefillData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const Booking: React.FC<BookingProps> = ({ prefillData }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем данные пользователя и статус из authSlice
  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Состояния для календаря и слотов
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );

  // Получаем доступные временные слоты из Redux
  const availableSlots = useSelector(selectAvailableSlots);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const successMessage = useSelector(selectBookingSuccess);

  // Запрашиваем доступные слоты при изменении даты
  useEffect(() => {
    if (date) {
      dispatch(fetchAvailableSlots(date.toISOString().split("T")[0]));
    }
  }, [date, dispatch]);

  // Обработка сообщений об успешном бронировании или ошибках
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearMessages());
    }
  }, [error, dispatch]);

  // Используем Formik для управления формой и валидации
  const formik = useFormik({
    initialValues: {
      name: prefillData?.name || "",
      email: prefillData?.email || "",
      phone: prefillData?.phone || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Заполните имя."),
      email: Yup.string()
        .email("Неверный формат email")
        .required("Заполните email."),
      phone: Yup.string().required("Заполните телефон."),
    }),
    onSubmit: (values) => {
      if (!date || !selectedTime) {
        console.error("Необходимо выбрать дату и время.");
        return;
      }

      // Создаем данные бронирования
      const bookingData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: "General Consultation",
        date: date.toISOString().split("T")[0],
        time: selectedTime,
      };

      // Разделяем логику для авторизованных и неавторизованных пользователей
      if (isLoggedIn && token) {
        dispatch(createBooking({ ...bookingData, token }));
      } else {
        dispatch(createBooking(bookingData));
      }
    },
  });

  return (
    <div className={styles.bookingSection}>
      <h2>Book a Consultation</h2>
      <form className={styles.bookingForm} onSubmit={formik.handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            {...formik.getFieldProps("name")}
            className={
              formik.touched.name && formik.errors.name ? styles.error : ""
            }
          />
          {formik.touched.name && formik.errors.name ? (
            <span className={styles.errorMessage}>{formik.errors.name}</span>
          ) : null}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...formik.getFieldProps("email")}
            className={
              formik.touched.email && formik.errors.email ? styles.error : ""
            }
          />
          {formik.touched.email && formik.errors.email ? (
            <span className={styles.errorMessage}>{formik.errors.email}</span>
          ) : null}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            {...formik.getFieldProps("phone")}
            className={
              formik.touched.phone && formik.errors.phone ? styles.error : ""
            }
          />
          {formik.touched.phone && formik.errors.phone ? (
            <span className={styles.errorMessage}>{formik.errors.phone}</span>
          ) : null}
        </div>

        <div className={styles.calendarContainer}>
          <Calendar
            onChange={(value) => {
              if (value && !Array.isArray(value)) {
                setDate(value);
              } else {
                setDate(null);
              }
            }}
            value={date}
            selectRange={false}
            tileDisabled={({ date }) => {
              const day = date.getDay();
              return day === 0 || day === 6; // 0 - Воскресенье, 6 - Суббота
            }}
          />
        </div>

        {date && (
          <div className={styles.timeSelection}>
            <h3>Choose Time:</h3>
            <select
              onChange={(e) => setSelectedTime(e.target.value)}
              value={selectedTime || ""}
            >
              <option value="" disabled>
                Choose time
              </option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available time slots
                </option>
              )}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedTime || loading}
          className={styles.bookButton}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      {successMessage && (
        <div className={styles.successMessage}>
          <h3>Booking Successful!</h3>
          <p>
            Thank you, <strong>{formik.values.name}</strong>!
            <br />
            You have successfully booked a consultation on{" "}
            <strong>{date?.toISOString().split("T")[0]}</strong> at{" "}
            <strong>{selectedTime}</strong>.
            <br />
            We will contact you shortly at{" "}
            <strong>{formik.values.phone}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Booking;
