import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:7687/api/integration/get-employee-leaves-count");
        setLeaves(response.data.data);
      } catch (err) {
        setError("Error fetching leaves data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const indexOfLastLeave = currentPage * itemsPerPage;
  const indexOfFirstLeave = indexOfLastLeave - itemsPerPage;
  const currentLeaves = leaves.slice(indexOfFirstLeave, indexOfLastLeave);
  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  if (loading) return <p>Loading leaves data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Employee Leave Records</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Employee ID</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">First Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Total Leaves</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeaves.length > 0 ? (
            currentLeaves.map((leave, index) => (
              <tr key={index} className="hover:bg-gray-300 hover:text-white">
                <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{leave.employee_id}</td>
                <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{leave.employee_firstname}</td>
                <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{leave.employee_lastname}</td>
                <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{leave.leave_count}</td>
                <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  <button onClick={() => handleViewDetails(leave)} className="btn btn-primary">View Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">No leave records found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange("prev")}
          className="mx-1 px-3 py-1 border rounded bg-white text-black"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2">{currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange("next")}
          className="mx-1 px-3 py-1 border rounded bg-white text-black"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-6">Employee Leaves Chart</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={leaves}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="employee_lastname" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leave_count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {isModalOpen && selectedLeave && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Leave Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="bg-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLeave.leaves.map((leave, index) => (
                    <tr key={index} className="hover:bg-gray-300 hover:text-white">
                      <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{leave.leave_type}</td>
                      <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">1</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeLeaves;
