import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../../../components/Header';

const SALARY_REQUEST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7687/api/salaryRequest"
    : "https://backend-hr3.jjm-manufacturing.com/api/salaryRequest";

function PayrollHistory() {
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const itemsPerPage = 5;

 
  const fetchPayrollHistory = async () => {
    try {
      const response = await axios.get(`${SALARY_REQUEST_URL}/get-all-payroll-history`);
      setPayrollHistory(response.data);
    } catch (err) {
      setError("Failed to fetch payroll history.");
      console.error("Error fetching payroll history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const handleSort = () => {
    const sortedData = [...payrollHistory].sort((a, b) => {
      const dateA = new Date(a.payrolls[0]?.payroll_date);
      const dateB = new Date(b.payrolls[0]?.payroll_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setPayrollHistory(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const openModal = (batch) => {
    setSelectedBatch(batch);
  };

  const closeModal = () => {
    setSelectedBatch(null);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payrollHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payrollHistory.length / itemsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">
        Payroll History
      </h2>
      <button
        onClick={handleSort}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Sort by Finalized Month ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>
      {payrollHistory.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No payroll history found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((batch) => (
            <div
              key={batch._id}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer"
              onClick={() => openModal(batch)}
            >
              <h3 className="text-xl font-semibold mb-3">
                Batch ID: {batch._id}
              </h3>
              <p>Finalized Date: {new Date(batch.payrolls[0]?.payroll_date).toLocaleDateString()}</p>
              <div className="mt-6 p-4 bg-white text-lg center font-bold text-center">
                Total Payroll Amount: ₱{batch.payrolls.reduce((total, emp) => total + Number(emp.netSalary), 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {payrollHistory.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-outline btn-primary mx-2"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline btn-primary mx-2"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">Batch Details</h2>
            <h3 className="text-lg font-semibold mb-2">Batch ID: {selectedBatch._id}</h3>
            <p>Finalized Date: {new Date(selectedBatch.payrolls[0]?.payroll_date).toLocaleDateString()}</p>
            <div className="overflow-x-auto mt-4">
              <table className="table w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Employee Name</th>
                    <th>Position</th>
                    <th>Total Work Hours</th>
                    <th>Gross Salary</th>
                    <th>Net Salary</th>
                    <th>Payroll Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBatch.payrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-gray-50">
                      <td>
                        {payroll.employee_firstname} {payroll.employee_lastname}
                      </td>
                      <td>{payroll.position}</td>
                      <td>{payroll.totalWorkHours}</td>
                      <td>₱{parseFloat(payroll.grossSalary).toFixed(2)}</td>
                      <td>₱{parseFloat(payroll.netSalary).toFixed(2)}</td>
                      <td>{new Date(payroll.payroll_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollHistory;
