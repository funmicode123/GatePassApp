import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import styles from "./GenerateOtp.module.css";

function GenerateOtp() {
  const [email, setEmail] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [message, setMessage] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const qrRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("You are not logged in!");
      navigate("/login");
    }
  }, [navigate]);


  const handleGenerateOtp = async () => {
    if (!visitorName.trim()) {
      setMessage("Visitor name cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resident/generate-otp`, {
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
        setMessage("OTP generated successfully!");
        setGeneratedOtp(data.otp);
      } else {
        setMessage(data.message || "Failed to generate OTP.");
      }
    } catch (error) {
      console.error("OTP generation error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleShare = async () => {
    const canvas = qrRef.current.querySelector("canvas");
    const imageUrl = canvas.toDataURL("image/png");
    
    // Check if sharing is supported
    if (navigator.share) {
      try {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], "visitor-qr.png", { type: "image/png" });
        
        await navigator.share({
          title: "Visitor Gate Pass",
          text: `Here is your gate pass OTP: ${generatedOtp}`,
          files: [file],
        });
      } catch (err) {
        console.error("Error sharing:", err);
        // Fallback: download the image
        downloadImage(imageUrl);
      }
    } else {
      downloadImage(imageUrl);
    }
  };

  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitor-qr-${generatedOtp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("QR Code downloaded! You can now share it with your visitor.");
  };

  return (
    <div className={styles.otpContainer}>
      <div className={`${styles.otpBox} glass-card`}>
        <h2 className={`${styles.title} text-gradient`}>Visitor Access</h2>
        <p className={styles.subtitle}>Generate a temporary OTP for your guest</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Enter visitor's name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
          />
          <button type="button" onClick={handleGenerateOtp}>Generate OTP</button>
        </form>

        {generatedOtp && (
          <div className={styles.otpDisplay}>
            <p>Share this pass with your visitor:</p>
            <div className={styles.otpValue}>
                <strong>{generatedOtp}</strong>
            </div>
            
            <div className={styles.qrWrapper} ref={qrRef}>
                <QRCodeCanvas 
                    value={generatedOtp} 
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={true}
                />
            </div>
            
            <button className={styles.shareBtn} onClick={handleShare}>
                Share Pass (OTP & QR)
            </button>
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default GenerateOtp;
