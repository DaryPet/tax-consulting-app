import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BookingProps {
  prefillData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

Modal.setAppElement("#root");

const Booking: React.FC<BookingProps> = ({ prefillData }) => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const availableSlots = useSelector(selectAvailableSlots);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const successMessage = useSelector(selectBookingSuccess);

  useEffect(() => {
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        rotationX: 360,
        rotationY: 360,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (date) {
      dispatch(fetchAvailableSlots(date.toISOString().split("T")[0]));
    }
  }, [date, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearMessages());
    }

    if (successMessage) {
      setIsModalOpen(true);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          x: "-100%",
        },
        {
          opacity: 1,
          x: "0%",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: prefillData?.name || "",
      email: prefillData?.email || "",
      phone: prefillData?.phone || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please provide your name."),
      email: Yup.string()
        .email("Invalid email format")
        .required("Please provide your email."),
      phone: Yup.string()
        .matches(
          /^\+?\d{10,15}$/,
          "Phone number is not valid. Use a correct format (e.g. +1234567890)."
        )
        .required("Please provide your phone number."),
    }),
    onSubmit: (values) => {
      let valid = true;

      if (!date) {
        setDateError("Please select a date.");
        valid = false;
      } else {
        setDateError(null);
      }

      if (!selectedTime) {
        setTimeError("Please select a time.");
        valid = false;
      } else {
        setTimeError(null);
      }

      if (!valid) {
        return;
      }

      if (date && selectedTime) {
        const bookingData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          service: "General Consultation",
          date: date.toISOString().split("T")[0],
          time: selectedTime,
        };

        if (isLoggedIn && token) {
          dispatch(createBooking({ ...bookingData, token }));
        } else {
          dispatch(createBooking(bookingData));
        }
      }
    },
  });

  return (
    <div className={styles.bookingSection}>
      <h2 ref={titleRef} className={styles.title}>
        Book a Consultation
      </h2>
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
              return day === 0 || day === 6;
            }}
          />
          {dateError && (
            <span className={styles.errorMessage}>{dateError}</span>
          )}
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
            {timeError && (
              <span className={styles.errorMessage}>{timeError}</span>
            )}
          </div>
        )}

        <button
          ref={buttonRef}
          type="submit"
          disabled={loading}
          className={styles.bookButton}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
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
          <button
            onClick={() => setIsModalOpen(false)}
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
