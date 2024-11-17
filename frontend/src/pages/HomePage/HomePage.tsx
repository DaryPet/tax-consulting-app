import React, { useEffect } from "react";
import styles from "./HomePage.module.css";
import AboutUs from "../../components/About/AboutUs";
import ServiceList from "../../components/Service/ServiceList";
import TeamList from "../../components/Team/TeamList";
import InfoCardsList from "../../components/InfoCards/InfoCardsList";
import Testimonials from "../../components/Testimonials/Testimonials";
import { useLocation } from "react-router-dom";
import Booking from "../../components/Booking/Booking";

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).targetId) {
      const targetId = (location.state as any).targetId;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div className={styles.homePage}>
      <section id="about" className={styles.section}>
        <AboutUs />
      </section>
      <section id="about" className={styles.section}>
        <InfoCardsList />
      </section>
      <section id="services" className={styles.section}>
        <p className={styles.sectionTitle}>Our service</p>
        <ServiceList />
      </section>
      <section id="team" className={styles.section}>
        <p className={styles.sectionTitle}>Our team</p>
        <TeamList />
      </section>
      <section id="testimonials" className={styles.section}>
        <p className={styles.sectionTitle}>Testimonials</p>
        <Testimonials />
      </section>
      <section id="booking" className={styles.section}>
        <Booking />
      </section>
    </div>
  );
};

export default HomePage;
