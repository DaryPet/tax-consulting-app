import React from "react";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  return (
    <div className={styles.testimonialsSection}>
      <form className={styles.form}>
        <input className={styles.input} type="text" placeholder="Ваше имя" />
        <textarea
          className={styles.textarea}
          placeholder="Ваш отзыв"
          rows={5}
        ></textarea>
        <button className={styles.submitButton} type="submit">
          Отправить
        </button>
      </form>
      <ul className={styles.testimonialsList}>
        <li className={styles.testimonialItem}>
          <span className={styles.author}>Пользователь 1:</span>
          <p className={styles.message}>Это отличный сервис!</p>
        </li>
        <li className={styles.testimonialItem}>
          <span className={styles.author}>Пользователь 2:</span>
          <p className={styles.message}>Очень удобно и быстро!</p>
        </li>
      </ul>
    </div>
  );
};

export default Testimonials;
