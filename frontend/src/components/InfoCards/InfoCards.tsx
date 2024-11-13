import React from "react";
import styles from "./InfoCards.module.css";
import infoCardsData from "../../data/infoCardsData";

const InfoCards: React.FC = () => {
  return (
    <div className={styles.infoCardsContainer}>
      {infoCardsData.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.iconWrapper}>
            <img
              src={card.iconUrl}
              alt={`${card.title} icon`}
              className={styles.icon}
            />
          </div>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.description}>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
