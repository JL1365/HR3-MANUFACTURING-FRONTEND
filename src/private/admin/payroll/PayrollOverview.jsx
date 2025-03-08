import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";

const PayrollOverview = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

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
        
        // Ensure we set only the array, not the entire response object
        setData(response.data.attendanceData || []);  
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []);
  

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(data.length / recordsPerPage) || 1;

  return (
    <div className="p-4">
      <Header title="Payroll Overview" />
      {error && <p className="text-red-500">Error: {error}</p>}
      {data.length === 0 ? (
        <p>No attendance records available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                {["Firstname", "Lastname", "Time In", "Time Out", "Total Hours", "Overtime Hours", "Status", "Remarks", "Entry Status", "Minutes Late", "Position"].map((header) => (
                  <th key={header} className="px-4 py-2 border">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item) => (
                <tr key={item._id} className="border">
                  <td className="px-4 py-2 border">{item.employee_firstname}</td>
                  <td className="px-4 py-2 border">{item.employee_lastname}</td>
                  <td className="px-4 py-2 border">{new Date(item.time_in).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(item.time_out).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{item.total_hours}</td>
                  <td className="px-4 py-2 border">{item.overtime_hours}</td>
                  <td className={`px-4 py-2 border ${item.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                    {item.status}
                  </td>
                  <td className="px-4 py-2 border">{item.remarks || "N/A"}</td>
                  <td className={`px-4 py-2 border ${item.entry_status === "late" ? "text-orange-600" : "text-black"}`}>
                    {item.entry_status}
                  </td>
                  <td className="px-4 py-2 border">{item.minutes_late || 0} min</td>
                  <td className="px-4 py-2 border">{item.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PayrollOverview;
