import React, { useState } from "react";
import styles from "../signup/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    houseNo: "",
    block: "",
    streetName: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const signupData = {
      email: formData.email,
      password: formData.password,
      role: "RESIDENT",
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      apartment: {
        house_no: formData.houseNo,
        block: formData.block,
        street_name: formData.streetName,
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success || response.ok) { // check response.ok too
        setMessage("Signup Successful! Please wait for Admin approval.");
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(data.message || "Signup failed!");
        setSuccess(false);
      }
    } catch (error) {
      console.log("Signup error:", error);
      setMessage("An error occurred. Please try again.");
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.signup}>
      <div className={`${styles.signupSide} glass-card`}>
        <div className={styles.header}>
          <h2 className={`${styles.title} text-gradient`}>Join Us</h2>
          <p className={styles.subtitle}>Create your resident account</p>
        </div>

        <form className={styles.signup_form} onSubmit={handleSubmit}>
          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label>First Name</label>
              <input name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className={styles.form_group}>
              <label>Last Name</label>
              <input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.form_group}>
            <label>Email Address</label>
            <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.form_group}>
            <label>Secure Password</label>
            <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>

          <div className={styles.form_group}>
            <label>Phone Number</label>
            <input name="phoneNumber" placeholder="080 000 0000" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          <p className={styles.section_title}>Apartment Location</p>
          <div className={styles.form_row}>
            <div className={styles.form_group} style={{ flex: 1 }}>
              <label>House No</label>
              <input name="houseNo" placeholder="A1" value={formData.houseNo} onChange={handleChange} required />
            </div>
            <div className={styles.form_group} style={{ flex: 1 }}>
              <label>Block</label>
              <input name="block" placeholder="Block B" value={formData.block} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.form_group}>
            <label>Street Name</label>
            <input name="streetName" placeholder="Main Street" value={formData.streetName} onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <div className={`${styles.messageBox} ${success ? styles.success : styles.error}`}>
            <p>{message}</p>
          </div>
        )}

        <p className={styles.sign_up_label}>
          Already part of the estate?
          <Link to="/login" className={styles.sign_up_link}> Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
