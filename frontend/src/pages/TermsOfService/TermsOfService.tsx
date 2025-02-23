// src/pages/TermsOfService.tsx
import React from "react";
import styles from "./TermsOfService.module.css";

const TermsOfService: React.FC = () => {
  return (
    <div>
      <section className={styles.section}>
        <h2 className={styles.title}>
          Terms <span className={styles.title_acent}>of Service</span>
        </h2>
        <p>
          Welcome to{" "}
          <span className={styles.text_acent}>FortuneTax Solutions</span>! By
          accessing or using our website and services, you agree to comply with
          these Terms of Service. Please read the following terms carefully
          before using our services.
        </p>

        <h3 className={styles.subtitle}>General Terms</h3>
        <p>
          These Terms of Service govern your use of our website and services. If
          you do not agree to these terms, you should not use our website or
          services. We reserve the right to modify these terms at any time
          without prior notice, so please review them regularly.
        </p>

        <h3 className={styles.subtitle}>User Responsibilities</h3>
        <p>
          You are responsible for ensuring the accuracy of the information you
          provide when using our services. You agree not to use our website for
          any unlawful purposes or activities that may harm our business or
          other users.
        </p>

        <h3 className={styles.subtitle}>Pricing and Payments</h3>
        <p>
          All prices for our services are listed on our website and may be
          subject to change. Payments must be made in full at the time of
          purchase unless otherwise stated. We reserve the right to refuse
          service or cancel orders in cases of payment issues.
        </p>

        <h3 className={styles.subtitle}>Refund and Cancellation Policy</h3>
        <p>
          For certain services, we offer a refund if the service is not
          delivered as promised. Please refer to our specific refund policy for
          details. If you wish to cancel or modify an order, please contact us
          as soon as possible.
        </p>

        <h3 className={styles.subtitle}>Limitation of Liability</h3>
        <p>
          We will not be held responsible for any indirect, incidental, or
          consequential damages arising from the use of our services or website.
          Our liability is limited to the amount paid for the specific service
          provided.
        </p>

        <h3 className={styles.subtitle}>Termination</h3>
        <p>
          We reserve the right to suspend or terminate your access to our
          services if you violate these Terms of Service. Upon termination, you
          agree to stop using our website and services.
        </p>

        <h3 className={styles.subtitle}>Contact Information</h3>
        <p>
          If you have any questions regarding these Terms of Service, please
          contact us at{" "}
          <a href="mailto:support@fortunetax.com">support@fortunetax.com</a>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
