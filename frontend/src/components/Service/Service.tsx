// import React from "react";
// import styles from "./Service.module.css";

// interface ServiceProps {
//   title: string;
//   description: string;
//   imageUrl: string;
//   buttonText: string;
//   buttonLink: string;
// }

// const Service: React.FC<ServiceProps> = ({
//   title,
//   description,
//   imageUrl,
//   buttonText,
//   buttonLink,
// }) => {
//   return (
//     <div className={styles.serviceCard}>
//       <img src={imageUrl} alt={title} className={styles.image} />
//       <h3 className={styles.title}>{title}</h3>
//       <p className={styles.description}>{description}</p>
//       <a href={buttonLink} className={styles.button}>
//         {buttonText}
//       </a>
//     </div>
//   );
// };

// export default Service;
import React from "react";
import styles from "./Service.module.css";

interface ServiceProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  onBookClick: () => void; // Функция для перехода на страницу бронирования
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
