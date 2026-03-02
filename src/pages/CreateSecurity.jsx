import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateSecurity.module.css";

function CreateSecurity() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        gate_location: "",
        role: "SECURITY"
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "ADMIN") {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/create-security`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setMessage("Security Staff account created!");
                setSuccess(true);
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    phone_number: "",
                    gate_location: "",
                    role: "SECURITY"
                });
            } else {
                setMessage(data.message || "Account creation failed.");
                setSuccess(false);
            }
        } catch (error) {
            setMessage("An error occurred.");
            setSuccess(false);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.box} glass-card`}>
                <h2 className={`${styles.title} text-gradient`}>New Security Staff</h2>
                <p className={styles.subtitle}>Register personnel for estate gate monitoring</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label>First Name</label>
                            <input name="first_name" placeholder="John" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className={styles.form_group}>
                            <label>Last Name</label>
                            <input name="last_name" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.form_group}>
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="security@estate.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className={styles.form_group}>
                        <label>Temporary Password</label>
                        <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className={styles.form_group}>
                        <label>Gate Assignment</label>
                        <input name="gate_location" placeholder="e.g. Main Entrance" value={formData.gate_location} onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Register Staff"}
                    </button>
                </form>

                {message && (
                    <div className={`${styles.messageBox} ${success ? styles.success : styles.error}`}>
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateSecurity;
