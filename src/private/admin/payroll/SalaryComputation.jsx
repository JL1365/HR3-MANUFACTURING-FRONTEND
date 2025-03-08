import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SALARY_REQUEST_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7687/api/salaryRequest"
    : "https://backend-hr3.jjm-manufacturing.com/api/salaryRequest";

const SalaryComputation = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get(
          `${SALARY_REQUEST_URL}/get-payroll-with-deductions`
        );
        setPayrollData(response.data.data);
      } catch (err) {
        setError("Failed to fetch payroll data.");
        console.error("Error fetching payroll:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  const finalizePayroll = async (batchId) => {
    try {
      setIsFinalizing(true);
      const response = await axios.post(
        `${SALARY_REQUEST_URL}/finalize-payroll`,
        { batch_id: batchId }
      );

      toast.success(response.data.message);
      setPayrollData(payrollData.filter((batch) => batch.batch_id !== batchId));
    } catch (error) {
      console.error("Error finalizing payroll:", error);
      toast.error(
        error.response?.data?.message || "Failed to finalize payroll"
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payrollData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payrollData.length / itemsPerPage);

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
      <h2 className="text-3xl font-bold text-center mb-6">
        Salary Computation
      </h2>

      {payrollData.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No payroll data available.
        </div>
      ) : (
        currentItems.map((batch) => (
          <div
            key={batch.batch_id}
            className="mb-6 bg-white shadow-md p-4 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-3">
              Batch ID: {batch.batch_id}
            </h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Total Work Hours</th>
                    <th>Overtime Hours</th>
                    <th>Hourly Rate</th>
                    <th>Overtime Rate</th>
                    <th>Salary</th>
                    <th>Deductions</th>
                    <th>Incentives</th>
                    <th>Adjusted Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.employees.map((employee) => (
                    <tr key={employee.employee_id} className="hover:bg-gray-50">
                      <td>{employee.employee_id}</td>
                      <td>
                        {employee.employee_firstname} {employee.employee_lastname}
                      </td>
                      <td>{employee.position}</td>
                      <td>{employee.totalWorkHours.toFixed(2)} hrs</td>
                      <td>{employee.totalOvertimeHours.toFixed(2)} hrs</td>
                      <td>₱{employee.hourlyRate.toFixed(2)}</td>
                      <td>₱{employee.overtimeRate.toFixed(2)}</td>
                      <td>₱{parseFloat(employee.salary).toFixed(2)}</td>
                      <td>₱{employee.benefitsDeductionsAmount.toFixed(2)}</td>
                      <td>₱{employee.incentiveAmount.toFixed(2)}</td>
                      <td>
                        <strong>₱{employee.adjustedSalary}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Finalize Payroll Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => finalizePayroll(batch.batch_id)}
                className="btn btn-primary"
                disabled={isFinalizing}
              >
                {isFinalizing ? "Finalizing..." : "Finalize Payroll"}
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {payrollData.length > 0 && (
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
    </div>
  );
};

export default SalaryComputation;
