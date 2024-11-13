import React from "react";
import styles from "./TestimonialCard.module.css";

interface TestimonialProps {
  client: string;
  text: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ client, text }) => {
  return (
    <div className={styles.testimonialCard}>
      <p className={styles.text}>"{text}"</p>
      <p className={styles.client}>- {client}</p>
    </div>
  );
};

export default Testimonial;
