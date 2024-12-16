import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../../assets/background/notFound.png";
import styles from "./NotFound.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <Link to="/" className={styles.backLink}>
        Go back to main page
      </Link>
      <img
        src={notFoundImage}
        alt="Page Not Found"
        className={styles.notFoundImage}
      />
    </div>
  );
};

export default NotFoundPage;
