
import React, { useEffect } from "react";
import styles from "./InfoCardsList.module.css";
import infoCardsData from "../../data/infoCardsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);


gsap.registerPlugin(ScrollTrigger);

const InfoCardsList: React.FC = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.card}`);
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.6,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Анимация иконки: вращение и смена цвета на красный
      const icon = card.querySelector(`.${styles.icon}`);
      if (icon) {
        gsap.fromTo(
          icon,
          { rotation: 0, filter: "grayscale(100%)" }, // Начальные значения (без цвета и без вращения)
          {
            rotation: 360, // Вращение на 360 градусов
            filter: "grayscale(0%)", // Убираем серый фильтр, возвращаем оригинальный цвет
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      const title = card.querySelector(`.${styles.title}`);
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 20 }, // Начальные значения
          {
            opacity: 1,
            y: 0, // Конечное положение
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: title,
              start: "top 80%", // Когда верх элемента будет на 80% экрана
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });
  }, []);

  return (
    <div className={styles.infoCardsContainer}>
      {infoCardsData.map((card, index) => (
        <div
          key={index}
          className={`${styles.card} ${
            index % 2 === 0 ? styles.offsetUp : styles.offsetDown
          }`}
        >
          <div className={styles.iconWrapper}>
            <img
              src={card.iconUrl}
              alt={`${card.title} icon`}
              className={styles.icon}
            />
          </div>
          <h3 className={`${styles.title} title`}>{card.title}</h3>
          <p className={`${styles.description} description`}>
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InfoCardsList;
