import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./BlacklistManager.module.css";

const BlacklistManager = () => {
    const [blacklist, setBlacklist] = useState([]);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const adminEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        fetchBlacklist();
    }, []);

    const fetchBlacklist = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/blacklist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlacklist(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blacklist:", error);
            setMessage("Failed to load blacklist");
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/blacklist/add?adminEmail=${adminEmail}`, 
                { name, phoneNumber, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Visitor blacklisted successfully!");
            setName("");
            setPhoneNumber("");
            setReason("");
            fetchBlacklist();
        } catch (error) {
            console.error("Error adding to blacklist:", error);
            setMessage(error.response?.data?.message || "Failed to blacklist visitor");
        }
    };

    const handleRemove = async (visitorName) => {
        if (!window.confirm(`Are you sure you want to remove ${visitorName} from the blacklist?`)) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/blacklist/remove?name=${visitorName}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Visitor removed from blacklist");
            fetchBlacklist();
        } catch (error) {
            console.error("Error removing from blacklist:", error);
            setMessage("Failed to remove visitor");
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={`${styles.card} glass-card`}>
                <h2 className="text-gradient">Blacklist Management</h2>
                <p className={styles.subtitle}>Flag individuals to prevent estate entry</p>

                <form onSubmit={handleAdd} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Phone Number (Optional)" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                        />
                    </div>
                    <textarea 
                        placeholder="Reason for blacklisting" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        required
                    />
                    <button type="submit" className={styles.addBtn}>Add to Blacklist</button>
                </form>

                {message && <p className={styles.message}>{message}</p>}

                <div className={styles.listSection}>
                    <h3>Blacklisted Individuals</h3>
                    <div className={styles.list}>
                        {blacklist.length === 0 ? (
                            <p className={styles.empty}>No entries in the blacklist.</p>
                        ) : (
                            blacklist.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.info}>
                                        <strong>{item.name}</strong>
                                        <span>{item.phoneNumber || "No phone"}</span>
                                        <p>{item.reason}</p>
                                        <small>Added by: {item.addedBy} on {new Date(item.addedAt).toLocaleDateString()}</small>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item.name)} 
                                        className={styles.removeBtn}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlacklistManager;
