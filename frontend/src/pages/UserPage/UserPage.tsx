import React from "react";
import UserDocuments from "../../components/UserDocuments/UserDocuments";
import Booking from "../../components/Booking/Booking";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../redux/slices/authSlice";
import styles from "./UserPage.module.css";

const UserPage: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className={styles.container}>
      <div className={styles.sectionDocuments}>
        <h2 className={styles.sectionTitle}>My Documents</h2>
        <UserDocuments />
      </div>

      <div className={styles.sectionBooking}>
        <h2 className={styles.sectionTitle}>Book Consultation</h2>

        <Booking
          prefillData={{
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
          }}
        />
      </div>
    </div>
  );
};

export default UserPage;
