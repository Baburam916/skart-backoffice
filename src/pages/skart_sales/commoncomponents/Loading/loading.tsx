import React from 'react'
import styles from "../Loading/loading.module.css"
export default function CommonLoading() {
  return (
    <div>
      <div className={styles["loader-wrapper"]}>
        <div className={styles["truck-wrapper"]}>
          <div className={styles.truck}>
            <div className={styles["truck-container"]}></div>
            <div className={styles["glases"]}></div>
            <div className={styles["bonet"]}></div>

            <div className={styles["base"]}></div>

            <div className={styles["base-aux"]}></div>
            <div className={styles["wheel-back"]}></div>
            <div className={styles["wheel-front"]}></div>

            <div className={styles["smoke"]}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
