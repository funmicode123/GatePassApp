import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className={`${styles.navbar} glass-card`}>
      <div className={styles.logo}>
        <Link to="/" className="text-gradient">GESTate</Link>
      </div>
      <div className={styles.links}>
        {role === "RESIDENT" && (
          <>
            <Link to="/generate-otp">Generate OTP</Link>
            <Link to="/exit">Exit Pass</Link>
          </>
        )}
        {role === "SECURITY" && (
          <>
            <Link to="/verify-otp">Verify OTP</Link>
            <Link to="/view">Logs</Link>
          </>
        )}
        {role === "ADMIN" && (
          <>
            <Link to="/addApartment">Add unit</Link>
            <Link to="/approveResident">Approve</Link>
            <Link to="/createSecurity">Staff</Link>
            <Link to="/blacklist">Blacklist</Link>
            <Link to="/view">Logs</Link>
          </>
        )}
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
