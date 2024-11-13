// import React from "react";
// import styles from "./ServiceList.module.css";
// import Service from "./Service";
// import servicesData from "../../data/servicesData";

// const ServiceList: React.FC = () => {
//   return (
//     <div className={styles.serviceGrid}>
//       {servicesData.map((service, index) => (
//         <Service
//           key={index}
//           title={service.title}
//           description={service.description}
//           imageUrl={service.imageUrl}
//           buttonText={service.buttonText}
//           buttonLink={service.buttonLink}
//         />
//       ))}
//     </div>
//   );
// };

// export default ServiceList;
import React from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate для перенаправления
import servicesData from "../../data/servicesData";
import Service from "./Service"; // Импортируем компонент Service
import styles from "./ServiceList.module.css";

const ServiceList: React.FC = () => {
  const navigate = useNavigate(); // Инициализируем hook для навигации

  // Обработчик открытия страницы бронирования
  const handleBookConsultation = () => {
    navigate("/booking"); // Переход на страницу бронирования
  };

  return (
    <div className={styles.serviceGrid}>
      {servicesData.map((service, index) => (
        <Service
          key={index}
          title={service.title}
          description={service.description}
          imageUrl={service.imageUrl}
          buttonText="Book Consultation"
          onBookClick={handleBookConsultation} // Передаем обработчик нажатия на кнопку бронирования
        />
      ))}
    </div>
  );
};

export default ServiceList;
