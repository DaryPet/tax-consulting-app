import React from "react";
import UserDocuments from "../../components/UserDocuments/UserDocuments";
import Booking from "../../components/Booking/Booking";
import Testimonials from "../../components/Testimonials/Testimonials";
import styles from "./UserPage.module.css";
const UserPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>My Documents</h2>
        <UserDocuments />
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Book consultation</h2>
        <Booking />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Testimonials</h2>
        <Testimonials />
      </div>
    </div>
  );
};

export default UserPage;
