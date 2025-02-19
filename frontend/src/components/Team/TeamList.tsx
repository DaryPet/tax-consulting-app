import React, { useEffect } from "react";
import styles from "./TeamList.module.css";
import teamData from "../../data/teamData";
import TeamMemberCard from "./TeamMemberCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TeamList: React.FC = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".teamCard");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.8, rotationY: 15 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
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
    });
  }, []);

  return (
    <div className={styles.teamContainer}>
      <h2 className={styles.heading}>Our Team</h2>
      <div className={styles.teamGrid}>
        {teamData.map((teamMember, index) => (
          <div className={`${styles.teamCard} teamCard`} key={index}>
            <TeamMemberCard
              name={teamMember.name}
              role={teamMember.role}
              imageUrl={teamMember.imageUrl}
              bio={teamMember.bio}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
