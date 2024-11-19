import React from "react";
import styles from "./Service.module.css";

interface ServiceProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  onBookClick: () => void;
}

const Service: React.FC<ServiceProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onBookClick,
}) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.image} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button className={styles.bookButton} onClick={onBookClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default Service;
