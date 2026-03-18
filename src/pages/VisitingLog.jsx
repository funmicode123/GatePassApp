import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitingLogs } from "../services/VisitingLogSlice";
import styles from "./VisitingLog.module.css";

const VisitingLog = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.visitingLogs);

  useEffect(() => {
    dispatch(fetchVisitingLogs());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{typeof error === 'string' ? error : "Failed to load logs"}</p>;

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} text-gradient`}>Estate Visiting Logs</h2>

      <div className={`${styles.logCard} glass-card`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Visitor Name</th>
              <th>OTP</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className={styles.email_cell}>{log.residentEmail}</td>
                <td className={styles.visitor_cell}>{log.visitorName}</td>
                <td><code style={{ color: 'var(--accent)' }}>{log.otp}</code></td>
                <td className={styles.time_cell}>
                  {log.checkInTime ? new Date(log.checkInTime).toLocaleString() : "---"}
                </td>
                <td className={styles.time_cell}>
                  {log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : "Active In-Estate"}
                </td>
                <td>
                  <span className={`${styles.status_badge} ${
                    log.otpStatus === 'USED' ? styles.status_active : 
                    log.otpStatus === 'EXITED' ? styles.status_exited : 
                    styles.status_expired
                  }`}>
                    {log.otpStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisitingLog;
