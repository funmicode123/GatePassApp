import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitingLogs } from "../services/VisitingLogSlice";

const SecurityDashboard = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.visitingLogs);

  useEffect(() => {
    dispatch(fetchVisitingLogs());
  }, [dispatch]);

  return (
    <div>
      <h2>Visiting Log</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Resident</th>
            <th>Visitor Name</th>
            <th>OTP</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Otp Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.residentEmail}</td>
              <td>{log.visitorName}</td>
              <td>{log.otp}</td>
              <td>{new Date(log.checkInTime).toLocaleString()}</td>
              <td>{new Date(log.checkOutTime).toLocaleString() || "Still In The Estate"}</td>
              <td>{log.otpStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityDashboard;
