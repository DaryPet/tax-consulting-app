import React from "react";
import styles from "./TeamList.module.css";
import teamData from "../../data/teamData";
import TeamMemberCard from "./TeamMemberCard";

const TeamList: React.FC = () => {
  return (
    <div className={styles.teamGrid}>
      {teamData.map((teamMember, index) => (
        <TeamMemberCard
          key={index}
          name={teamMember.name}
          role={teamMember.role}
          imageUrl={teamMember.imageUrl}
          bio={teamMember.bio}
        />
      ))}
    </div>
  );
};

export default TeamList;
