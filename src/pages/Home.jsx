import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>
            Secure Estate <br /> Management
          </h1>
          <p className={styles.subtitle}>
            A premium gate pass system designed for modern communities.
            Efficient visits, secure verification, and total peace of mind.
          </p>

          {!token ? (
            <div className={styles.cta}>
              <Link to="/login" className={styles.primaryBtn}>Get Started</Link>
              <Link to="/signup" className={styles.secondaryBtn}>Resident Signup</Link>
            </div>
          ) : (
            <div className={styles.cta}>
              {role === "RESIDENT" && <Link to="/generate-otp" className={styles.primaryBtn}>Generate OTP</Link>}
              {role === "SECURITY" && <Link to="/verify-otp" className={styles.primaryBtn}>Verify Visitor</Link>}
              {role === "ADMIN" && <Link to="/addApartment" className={styles.primaryBtn}>Manage Units</Link>}
            </div>
          )}
        </div>

        <div className={styles.stats}>
          <div className={`${styles.statCard} glass-card`}>
            <h3>24/7</h3>
            <p>Secure Monitoring</p>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <h3>Instant</h3>
            <p>OTP Matching</p>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <h3>Trusted</h3>
            <p>by Golden Estate</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
