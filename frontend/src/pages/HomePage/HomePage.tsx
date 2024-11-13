import React from "react";
import styles from "./HomePage.module.css";
import AboutUs from "../../components/About/AboutUs";
import ServiceList from "../../components/Service/ServiceList";
import TeamList from "../../components/Team/TeamList";
// import TestimonialsList from "../../components/Testimonials/TestimonialList";
import InfoCardsList from "../../components/InfoCards/InfoCardsList";
import Testimonials from "../../components/Testimonials/Testimonials";

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className={styles.homeContainer}>
        {/* Header Placeholder */}
        <header className={styles.header}>Header Placeholder</header>

        {/* About Section */}
        <section className={styles.aboutSection}>
          <AboutUs />
        </section>
        <section>
          <InfoCardsList />
        </section>
        {/* Service Section */}
        <section className={styles.serviceSection}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <ServiceList />
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Meet the Team</h2>
          <TeamList />
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection}>
          <h2 className={styles.sectionTitle}>Testimonials</h2>
          <Testimonials />
        </section>

        {/* Footer Placeholder */}
        <footer className={styles.footer}>Footer Placeholder</footer>
      </div>
    </div>
  );
};

export default HomePage;
