import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddApartment.module.css";

function AddApartment() {
    const [formData, setFormData] = useState({
        house_no: "",
        block: "",
        street_name: "",
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/apartments/add`, {
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
                setMessage("Apartment added successfully!");
                setSuccess(true);
                setFormData({ house_no: "", block: "", street_name: "" });
            } else {
                setMessage(data.message || "Failed to add apartment.");
                setSuccess(false);
            }
        } catch (error) {
            console.error("Error adding apartment:", error);
            setMessage("An error occurred. Please try again.");
            setSuccess(false);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.box} glass-card`}>
                <h2 className={`${styles.title} text-gradient`}>Add Apartment</h2>
                <p className={styles.subtitle}>Register a new unit in the estate</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.form_group}>
                        <label>House Number</label>
                        <input
                            name="house_no"
                            placeholder="e.g. A1"
                            value={formData.house_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label>Block / Phase</label>
                        <input
                            name="block"
                            placeholder="e.g. Block B"
                            value={formData.block}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.form_group}>
                        <label>Street Name</label>
                        <input
                            name="street_name"
                            placeholder="e.g. Adeolu Street"
                            value={formData.street_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding Unit..." : "Register Apartment"}
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

export default AddApartment;
