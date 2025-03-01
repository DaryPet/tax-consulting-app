// Loader.tsx
import React from "react";
import styles from "./Loader.module.css";

const Loader: React.FC = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
);

export default Loader;
