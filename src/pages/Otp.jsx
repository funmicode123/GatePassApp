import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./Otp.module.css";

function Otp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [apartmentDetails, setApartmentDetails] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      });

      scanner.render((decodedText) => {
        setOtp(decodedText);
        setShowScanner(false);
        scanner.clear();
        // Automatically trigger verification after scan
        verifyOtp(decodedText);
      }, (error) => {
        // console.warn(error);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [showScanner]);

  const verifyOtp = async (otpValue) => {
    const securityEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/security/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          otp: otpValue,
          security_email: securityEmail
        }),
      });

      const data = await response.json();
      setMessage(data.message);
      setIsSuccess(data.success);
      
      if (data.success) {
        setApartmentDetails(data.apartmentDetails);
      } else {
        setApartmentDetails("");
      }

      if (data.success && !data.message.includes("BLACKLISTED")) {
        // Keep message visible for longer if success to show address
        setTimeout(() => {
          // navigate("/viewLogs");
        }, 5000);
      }

    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      return setMessage("Please enter a valid 6-digit OTP.");
    }
    verifyOtp(otp);
  };

  return (
    <div className={styles.otpContainer}>
      <div className={`${styles.otpBox} glass-card`}>
        <h2 className={`${styles.title} text-gradient`}>Security Check</h2>
        <p className={styles.subtitle}>Verify visitor OTP or Scan QR Pass</p>

        {!showScanner ? (
            <>
                <form onSubmit={handleVerifyOtp}>
                <input
                    type="text"
                    className={styles.otpInput}
                    placeholder="000000"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit" className={styles.verifyBtn}>Verify & Log Entry</button>
                </form>
                <div className={styles.divider}>OR</div>
                <button 
                    type="button" 
                    className={styles.scanBtn}
                    onClick={() => setShowScanner(true)}
                >
                    Scan QR Code
                </button>
            </>
        ) : (
            <div className={styles.scannerWrapper}>
                <div id="reader"></div>
                <button 
                    className={styles.cancelScanBtn}
                    onClick={() => setShowScanner(false)}
                >
                    Cancel Scan
                </button>
            </div>
        )}

        {message && (
          <div className={`${styles.statusCard} ${isSuccess ? styles.successCard : styles.errorCard} ${message.includes("BLACKLISTED") ? styles.blacklistAlert : ""}`}>
            <p className={styles.statusMessage}>{message}</p>
            {isSuccess && apartmentDetails && (
                <div className={styles.addressBox}>
                    <p>Resident Address:</p>
                    <strong>{apartmentDetails}</strong>
                </div>
            )}
            {isSuccess && (
                <button className={styles.doneBtn} onClick={() => navigate("/viewLogs")}>
                    Done
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Otp;
