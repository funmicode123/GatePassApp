import React, { useState } from "react";
import axios from "axios";
import styles from "../login/Login.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required!");
      setIsSuccess(false);
      return;
    }

    setMessage("");
    setLoading(true);

    const loginData = { email, password };
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/user/login`;
    console.log("Login Attempt:", { apiUrl, loginData });

    try {
      const response = await axios.post(apiUrl, loginData);
      const data = response.data;
      
      setLoading(false);
      console.log("Login Success:", data);

      if (data.success) {
        setMessage("Login Successful!");
        setIsSuccess(true);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", data.userRole);
        localStorage.setItem("token", data.accessToken);

        setTimeout(() => {
          switch (data.userRole) {
            case "RESIDENT":
              navigate("/generate-otp");
              break;
            case "SECURITY":
              navigate("/verify-otp");
              break;
            case "ADMIN":
              navigate("/addApartment");
              break;
            default:
              setMessage(`Invalid role assigned: ${data.userRole}. Please contact support.`);
              setIsSuccess(false);
          }
        }, 1500);

      } else {
        setMessage(data.message || "Invalid login credentials!");
        setIsSuccess(false);
      }

    } catch (error) {
      console.error("Login Error Details:", error);
      setLoading(false);
      
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        setMessage(error.response.data.message || "Invalid login credentials!");
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("Network error: Backend server is not reachable.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage("An error occurred. Please try again.");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={`${styles.loginSide} glass-card`}>
        <div className={styles.header}>
          <h2 className={`${styles.title} text-gradient`}>Welcome</h2>
          <p className={styles.subtitle}>Sign in to your estate account</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.form_group}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className={styles.forgot_password}>Forgot password?</p>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {message && (
          <div className={`${styles.messageBox} ${isSuccess ? styles.success : styles.error}`}>
            <p>{message}</p>
          </div>
        )}

        <p className={styles.sign_up_label}>
          New to the estate?
          <Link to="/signup" className={styles.sign_up_link}> Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
