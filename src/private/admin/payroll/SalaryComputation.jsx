import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../../../components/Header'
import PayrollHistory from "./PayrollHistory";

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
   
    const isConfirmed = window.confirm(
      "Are you sure you want to finalize the payroll?"
    );
    
    if (!isConfirmed) {
      return; 
    }
  
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
  

  const printPDF = () => {
    const printWindow = window.open("", "", "height=600,width=800");

    const generateEmployeeRows = (batch) => {
      return batch.employees
        .map((employee) => {
          return `
            <tr>
              <td>${employee.employee_id}</td>
              <td>${employee.employee_firstname} ${employee.employee_lastname}</td>
              <td>${employee.position}</td>
              <td>${employee.totalWorkHours.toFixed(2)} hrs</td>
              <td>${employee.totalOvertimeHours.toFixed(2)} hrs</td>
              <td>₱${employee.hourlyRate.toFixed(2)}</td>
              <td>₱${employee.overtimeRate.toFixed(2)}</td>
              <td>₱${parseFloat(employee.salary).toFixed(2)}</td>
              <td>₱${employee.benefitsDeductionsAmount.toFixed(2)}</td>
              <td>₱${employee.incentiveAmount.toFixed(2)}</td>
              <td><strong>₱${employee.adjustedSalary}</strong></td>
            </tr>
          `;
        })
        .join('');
    };

    const batchesToPrint = payrollData;

    const printContent = batchesToPrint.map((batch) => {
      return `
        <div>
          <h3>Batch ID: ${batch.batch_id}</h3>
          <table>
            <thead>
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
              ${generateEmployeeRows(batch)}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
          }
          th {
            background-color: #f2f2f2;
          }
          .page-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="content-wrapper">
          <div class="page-title">Salary Computation</div>
          ${printContent}
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
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
        <Header title="Salary Computation"/>

      <div className="flex justify-between mb-4">
        <button
          onClick={printPDF}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download as PDF
        </button>
        <button
          onClick={() => finalizePayroll(currentItems[0]?.batch_id)}
          className="btn btn-primary"
          disabled={isFinalizing}
        >
          {isFinalizing ? "Finalizing..." : "Finalize Payroll"}
        </button>
      </div>

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
      <PayrollHistory />
    </div>
  );
};

export default SalaryComputation;
