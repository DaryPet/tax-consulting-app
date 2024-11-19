import React from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../../data/servicesData";
import Service from "./Service";
import styles from "./ServiceList.module.css";

const ServiceList: React.FC = () => {
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    navigate("/booking");
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
          onBookClick={handleBookConsultation}
        />
      ))}
    </div>
  );
};

export default ServiceList;
