import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";

const SalaryComputation = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7687/api/salaryRequest/get-payroll-with-deductions"
        );
        setPayrollData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, []);

  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = payrollData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(payrollData.length / recordsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Finalize Payroll
  const handleFinalizePayroll = async () => {
    if (!window.confirm("Are you sure you want to finalize the payroll?")) return;

    setIsFinalizing(true);
    try {
      const response = await axios.post("http://localhost:7687/api/salaryRequest/finalize-payroll");
      alert(response.data.message);
      setPayrollData([]); // Clear table after finalization
    } catch (err) {
      alert("Error finalizing payroll: " + err.message);
    } finally {
      setIsFinalizing(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading payroll data...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="p-6">
      <Header title="Salary Computation" />
      <h2 className="text-2xl font-semibold mb-4">Salary Computation</h2>

      {payrollData.length === 0 ? (
        <p className="text-gray-500 text-center">No payroll data available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Employee Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Overtime Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Hourly Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Overtime Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentives</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Adjusted Salary</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((employee) => (
                  <tr key={employee.employee_id} className="hover:bg-gray-300 hover:text-white">
                    <td className="px-6 py-4">{`${employee.employee_firstname} ${employee.employee_lastname}`}</td>
                    <td className="px-6 py-4">{employee.position}</td>
                    <td className="px-6 py-4">{employee.totalWorkHours}</td>
                    <td className="px-6 py-4">{employee.totalOvertimeHours}</td>
                    <td className="px-6 py-4">{employee.hourlyRate}</td>
                    <td className="px-6 py-4">{employee.overtimeRate}</td>
                    <td className="px-6 py-4">{employee.salary}</td>
                    <td className="px-6 py-4">{employee.benefitsDeductionsAmount}</td>
                    <td className="px-6 py-4">{employee.incentiveAmount}</td>
                    <td className="px-6 py-4 font-bold">{employee.adjustedSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Finalize Payroll Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleFinalizePayroll}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              disabled={isFinalizing}
            >
              {isFinalizing ? "Finalizing..." : "Finalize Payroll"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryComputation;
