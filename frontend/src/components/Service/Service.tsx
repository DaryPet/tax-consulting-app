import React, { useEffect, useRef } from "react";
import styles from "./Service.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0.8, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.image} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        ref={buttonRef}
        className={styles.bookButton}
        // className={`${styles.bookButton} ${styles.pulse}`}
        onClick={onBookClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Service;
