import React, { useEffect } from "react";
import styles from "./AboutUs.module.css";
import { gsap } from "gsap";

import { TextPlugin } from "gsap/TextPlugin";
// import ParticlesBackground from "../ParticlesBackground/ParticlesBackground";

gsap.registerPlugin(TextPlugin);

const AboutUs: React.FC = () => {
  useEffect(() => {
    const textElement = document.querySelector(".description");

    if (textElement) {
      const chars = textElement.textContent?.split("") || [];
      textElement.innerHTML = "";
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        textElement.appendChild(span);
      });

      gsap.from(".description span", {
        opacity: 0,
        color: "blue",
        duration: 0.2,
        stagger: 0.04,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".title",
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);
  return (
    <div className={styles.aboutContainer}>
      {/* <ParticlesBackground /> */}
      <h2 className={`${styles.title} title`}>About Us</h2>
      <p className={`${styles.description} description`}>
        We are a tax advisory firm dedicated to helping individuals and
        businesses with tax planning, compliance, and consulting.
      </p>
    </div>
  );
};

export default AboutUs;
