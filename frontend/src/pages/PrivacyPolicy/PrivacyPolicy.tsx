// src/pages/PrivacyPolicy.tsx
import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <div>
      <section className={styles.section}>
        <h2 className={styles.title}>
          Privacy <span className={styles.title_acent}>Policy</span>
        </h2>
        <p>
          At <span className={styles.text_acent}>FortuneTax Solutions</span>, we
          value your privacy. This Privacy Policy outlines how we collect, use,
          and protect your personal information when you visit our website or
          use our services. We are committed to ensuring your privacy is
          safeguarded in accordance with applicable privacy laws.
        </p>
        <h3 className={styles.subtitle}>Information We Collect</h3>
        <p>
          We may collect personal information such as your name, email address,
          phone number, and payment details when you sign up for our services,
          make a purchase, or interact with our website.
        </p>

        <h3 className={styles.subtitle}>How We Use Your Information</h3>
        <p>
          The information we collect is used to provide you with the best
          experience possible. This includes processing your orders, responding
          to your inquiries, sending you important updates, and improving our
          services.
        </p>

        <h3 className={styles.subtitle}>Data Security</h3>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access or disclosure. However, no method of electronic
          storage or transmission over the Internet is completely secure, and we
          cannot guarantee absolute security.
        </p>

        <h3 className={styles.subtitle}>Third-Party Services</h3>
        <p>
          We may use third-party services for certain features on our site, such
          as payment processors. These third-party services have their own
          privacy policies that govern the use of your data.
        </p>

        <h3 className={styles.subtitle}>Your Rights</h3>
        <p>
          You have the right to access, correct, or delete your personal data.
          If you have any concerns or questions regarding your personal
          information, please contact us at{" "}
          <a href="mailto:support@fortunetax.com">support@fortunetax.com</a>.
        </p>

        <h3 className={styles.subtitle}>Changes to this Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and the updated version will be effective
          immediately upon posting.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
