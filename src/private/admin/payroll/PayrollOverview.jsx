import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
const PayrollOverview = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:7687/api/integration/get-all-attendance-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        console.log("Data fetched:", response.data);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header title="Payroll Overview" />
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Username</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total Hours</th>
              <th>Overtime Hours</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Entry Status</th>
              <th>Minutes Late</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.employee_id}</td>
                <td>{item.employee_username}</td>
                <td>{new Date(item.time_in).toLocaleString()}</td>
                <td>{new Date(item.time_out).toLocaleString()}</td>
                <td>{item.total_hours}</td>
                <td>{item.overtime_hours}</td>
                <td style={{ color: item.status === "approved" ? "green" : "red" }}>
                  {item.status}
                </td>
                <td>{item.remarks || "N/A"}</td>
                <td style={{ color: item.entry_status === "late" ? "orange" : "black" }}>
                  {item.entry_status}
                </td>
                <td>{item.minutes_late} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayrollOverview;
