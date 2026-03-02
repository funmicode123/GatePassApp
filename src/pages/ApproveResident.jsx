import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ApproveResident.module.css";
import axios from "axios";

function ApproveResident() {
    const [residents, setResidents] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "ADMIN") {
            navigate("/login");
            return;
        }
        fetchPendingResidents();
    }, [navigate]);

    const fetchPendingResidents = async () => {
        // Note: Assuming there's a backend endpoint to get pending residents. 
        // If not, we'll suggest it, but for now, we'll use a placeholder or 
        // try to fetch all users if the API supports filtering.
        // Since we don't have a specific "get pending" endpoint, I'll recommend adding it.
        // For this demo, we'll simulate the approval workflow.
        setLoading(false);
    };

    const handleApprove = async (email) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/approve-resident/${email}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                setMessage(`Approved ${email} successfully!`);
                // Refresh list
            } else {
                setMessage("Approval failed.");
            }
        } catch (err) {
            setMessage("Error performing approval.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.box} glass-card`}>
                <h2 className={`${styles.title} text-gradient`}>Resident Approvals</h2>
                <p className={styles.subtitle}>Activate pending accounts to grant estate access</p>

                <div className={styles.infoBox}>
                    <p>Enter the email of the resident you wish to approve below.</p>
                </div>

                <form className={styles.approvalForm} onSubmit={(e) => {
                    e.preventDefault();
                    handleApprove(e.target.email.value);
                    e.target.reset();
                }}>
                    <input name="email" type="email" placeholder="resident@example.com" required />
                    <button type="submit">Approve Resident</button>
                </form>

                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
}

export default ApproveResident;
