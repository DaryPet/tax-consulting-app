import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../../data/servicesData";
import Service from "./Service";
import styles from "./ServiceList.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceList: React.FC = () => {
  const navigate = useNavigate();
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleBookConsultation = () => {
    navigate("/booking");
  };
  useEffect(() => {
    serviceRefs.current.forEach((service, index) => {
      if (service) {
        // gsap.fromTo(
        //   service,
        //   { opacity: 0, y: 50, scale: 0.8 }, // Начальное состояние карточки
        //   {
        //     opacity: 1,
        //     y: 0, // Конечная позиция
        //     scale: 1,
        //     duration: 1,
        //     ease: "power2.out",
        //     scrollTrigger: {
        //       trigger: service,
        //       start: "top 80%", // Когда верх карточки будет на 80% экрана
        //       end: "bottom top",
        //       scrub: true,
        //     },
        //   }
        // );
        gsap.fromTo(
          service,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: service,
              start: "top 80%",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });
  }, []);

  return (
    <div className={styles.serviceGrid}>
      {servicesData.map((service, index) => (
        <div key={index} ref={(el) => (serviceRefs.current[index] = el)}>
          <Service
            title={service.title}
            description={service.description}
            imageUrl={service.imageUrl}
            buttonText="Book Consultation"
            onBookClick={handleBookConsultation}
          />
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
