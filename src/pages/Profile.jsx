import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Profile.module.css";

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
        gateLocation: "",
        apartment: {
            houseNo: "",
            block: "",
            streetName: ""
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    console.log("Current Profile State:", profile);
    console.log("Is Editing:", isEditing);

    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail"); 

    useEffect(() => {
        if (!userEmail || !token) {
            setMessage("Please login to view your profile");
            setLoading(false);
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/profile?email=${userEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = response.data;
            // Ensure apartment is an object even if null from backend
            if (!data.apartment) {
                data.apartment = { houseNo: "", block: "", streetName: "" };
            }
            
            setProfile(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage("Failed to load profile. Please make sure you are logged in.");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("apartment.")) {
            const field = name.split(".")[1];
            setProfile(prev => ({
                ...prev,
                apartment: { ...prev.apartment, [field]: value }
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                gateLocation: profile.gateLocation,
                apartment: profile.apartment ? {
                    house_no: profile.apartment.houseNo,
                    block: profile.apartment.block,
                    street_name: profile.apartment.streetName
                } : null
            };

            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/user/profile?email=${userEmail}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            if (!data.apartment) {
                data.apartment = { houseNo: "", block: "", streetName: "" };
            }
            setProfile(data);
            setIsEditing(false);
            setMessage("Profile updated successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile");
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={`${styles.profileCard} glass-card`}>
                <h2 className="text-gradient">User Profile</h2>
                {message && <p className={styles.message}>{message}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email (Read-only)</label>
                            <input type="email" value={profile.email} disabled />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={profile.phoneNumber || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Role</label>
                            <input type="text" value={profile.role} disabled />
                        </div>

                        {profile.role === "SECURITY" && (
                            <div className={styles.inputGroup}>
                                <label>Gate Location</label>
                                <input
                                    type="text"
                                    name="gateLocation"
                                    value={profile.gateLocation || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        )}
                    </div>

                    {profile.role === "RESIDENT" && profile.apartment && (
                        <div className={styles.apartmentSection}>
                            <h3>Apartment Details</h3>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>House No</label>
                                    <input
                                        type="text"
                                        name="apartment.houseNo"
                                        value={profile.apartment.houseNo || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Block</label>
                                    <input
                                        type="text"
                                        name="apartment.block"
                                        value={profile.apartment.block || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Street Name</label>
                                    <input
                                        type="text"
                                        name="apartment.streetName"
                                        value={profile.apartment.streetName || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {!isEditing ? (
                            <button type="button" onClick={() => { console.log("Edit Clicked"); setIsEditing(true); }} className={styles.editBtn}>
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button type="submit" className={styles.saveBtn}>Save Changes</button>
                                <button type="button" onClick={() => { console.log("Cancel Clicked"); setIsEditing(false); }} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
