import React from "react";
import styles from "./AboutUs.module.css";

const AboutUs: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <h2 className={styles.title}>About Us</h2>
      <p className={styles.description}>
        We are a tax advisory firm dedicated to helping individuals and
        businesses with tax planning, compliance, and consulting.
      </p>
    </div>
  );
};

export default AboutUs;
