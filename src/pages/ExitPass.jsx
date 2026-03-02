import React, { useState } from "react";
import styles from "./ExitPass.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function GenerateExitPass() {
  const [email, setEmail] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [message, setMessage] = useState("");
  const [exitTime, setExitTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("You are not logged in!");
      navigate("/login");
    }
  }, [navigate]);

  const handleGenerateExitPass = async (e) => {
    e.preventDefault();

    if (!visitorName.trim()) {
      setMessage("Visitor name cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resident/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          resident_email: email,
          visitor_name: visitorName
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Exit pass generated successfully for: ${visitorName}`);
        setExitTime(new Date().toLocaleTimeString());
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.passBox} glass-card`}>
        <h2 className={`${styles.title} text-gradient`}>Exit Pass</h2>
        <p className={styles.subtitle}>Generate a checkout pass for your visitor</p>

        <form onSubmit={handleGenerateExitPass} className={styles.form}>
          <input
            type="text"
            placeholder="Visitor's Full Name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
          />
          <button type="submit">Issue Exit Pass</button>
        </form>

        {(message || exitTime) && (
          <div className={styles.details}>
            {message && <p className={styles.message}>{message}</p>}
            {exitTime && (
              <div className={styles.timestamp}>
                <span>Issued at:</span>
                <strong>{exitTime}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateExitPass;
