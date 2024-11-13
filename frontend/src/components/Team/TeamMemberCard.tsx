import React from "react";
import styles from "./TeamMemeberCard.module.css";

interface TeamProps {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

const TeamMemberCard: React.FC<TeamProps> = ({ name, role, imageUrl, bio }) => {
  return (
    <div className={styles.teamCard}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.role}>{role}</p>
      <p className={styles.bio}>{bio}</p>
    </div>
  );
};

export default TeamMemberCard;
