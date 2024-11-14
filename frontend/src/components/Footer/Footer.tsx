// frontend/src/components/Footer/Footer.tsx
import React from "react";
import styles from "./Footer.module.css";
import {
  FaFacebookF,
  FaTelegramPlane,
  FaWhatsapp,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Навигация по страницам */}
        <div className={styles.navLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/#about">About Us</a>
            </li>
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <a href="/#team">Our Team</a>
            </li>
            <li>
              <a href="/#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="/booking">Book a Consultation</a>
            </li>
          </ul>
        </div>

        {/* Контакты */}
        <div className={styles.contactInfo}>
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope /> support@fortunetax.com
          </p>
          <p>Phone: +1 234 567 8900</p>
        </div>

        {/* Социальные сети */}
        <div className={styles.socialLinks}>
          <h3>Follow Us</h3>
          <div className={styles.icons}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://t.me/yourtelegramchannel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://wa.me/12345678900"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://linkedin.com/company/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Подписка на новости */}
        <div className={styles.newsletter}>
          <h3>Subscribe to Our Newsletter</h3>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} FortuneTax Solutions. All rights
          reserved.
        </p>
        <ul className={styles.footerLinks}>
          <li>
            <a href="/privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <a href="/terms-of-service">Terms of Service</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
