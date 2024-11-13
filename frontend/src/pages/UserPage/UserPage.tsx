// import React from "react";
// import UserDocuments from "../../components/UserDocuments/UserDocuments";
// import Booking from "../../components/Booking/Booking";
// import Testimonials from "../../components/Testimonials/TestimonialList";
// import styles from "./UserPage.module.css";
// const UserPage = () => {
//   return (
//     <div className={styles.container}>
//       <div className={styles.section}>
//         <h2 className={styles.sectionTitle}>My Documents</h2>
//         <UserDocuments />
//       </div>
//       <div className={styles.section}>
//         <h2 className={styles.sectionTitle}>Book consultation</h2>
//         <Booking />
//       </div>

//       <div className={styles.section}>
//         <h2 className={styles.sectionTitle}>Testimonials</h2>
//         <Testimonials />
//       </div>
//     </div>
//   );
// };

// export default UserPage;
// src/pages/UserPage/UserPage.tsx

import React from "react";
import UserDocuments from "../../components/UserDocuments/UserDocuments";
import Booking from "../../components/Booking/Booking";
import Testimonials from "../../components/Testimonials/TestimonialList";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../redux/slices/authSlice";
import styles from "./UserPage.module.css";

const UserPage: React.FC = () => {
  const user = useSelector(selectAuthUser);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>My Documents</h2>
        <UserDocuments />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Book Consultation</h2>
        {/* Передаем данные пользователя в компонент Booking для заполнения полей автоматически */}
        <Booking
          prefillData={{
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
          }}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Testimonials</h2>
        <Testimonials />
      </div>
    </div>
  );
};

export default UserPage;
