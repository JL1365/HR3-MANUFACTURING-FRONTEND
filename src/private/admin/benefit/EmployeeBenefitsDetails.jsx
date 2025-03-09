import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";

const BENEFIT_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/benefit" 
  : "https://backend-hr3.jjm-manufacturing.com/api/benefit";

function EmployeeBenefitsDetails() {
  const [employeeBenefits, setEmployeeBenefits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  const itemsPerPage = 10;
  const modalItemsPerPage = 5;
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchEmployeeBenefitDetails();
  }, []);

  const fetchEmployeeBenefitDetails = async () => {
    try {
      const response = await axios.get(
        `${BENEFIT_URL}/get-all-employees-benefit-details`
      );
      const benefitRequests = response.data.benefitRequests.map((request) => ({
        ...request,
        benefitDeductions: response.data.benefitDeductions.filter(
          (deduction) =>
            deduction.BenefitRequestId?._id.toString() === request._id.toString()
        ),
      }));

      setEmployeeBenefits(benefitRequests);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    }
  };

const printPDF = () => {
  const printWindow = window.open("", "", "height=600,width=800");

  const generateDeductionsRows = (benefit) => {
    return benefit.benefitDeductions
      .map((deduction) => {
        return `
          <tr>
            <td>${deduction.amount}</td>
            <td>${new Date(deduction.createdAt).toLocaleDateString()}</td>
          </tr>
        `;
      })
      .join('');
  };

  const benefitsToPrint = searchName ? filteredEmployeeBenefits : employeeBenefits;

  const printContent = benefitsToPrint.map((benefit) => {
    return `
      <tr>
        <td>${benefit.userId?.lastName}, ${benefit.userId?.firstName}</td>
        <td>${benefit.benefitId?.benefitName}</td>
        <td>${benefit.status}</td>
        <td>
          ${benefit.uploadDocs?.frontId ? 
            `<img src="${benefit.uploadDocs.frontId}" alt="Front ID" style="max-width: 150px; height: auto;" />` 
            : "No Front ID"}
        </td>
        <td>
          ${benefit.uploadDocs?.backId ? 
            `<img src="${benefit.uploadDocs.backId}" alt="Back ID" style="max-width: 150px; height: auto;" />` 
            : "No Back ID"}
        </td>
        <td>${new Date(benefit.createdAt).toLocaleDateString()}</td>
        <td>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${generateDeductionsRows(benefit)}
            </tbody>
          </table>
        </td>
      </tr>
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
        td img {
          max-width: 150px;
          height: auto;
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
        <div class="page-title">Employee Benefit Details</div>
        <table id="benefitTable">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Benefit Name</th>
              <th>Status</th>
              <th>Front ID</th>
              <th>Back ID</th>
              <th>Date</th>
              <th>Deductions</th>
            </tr>
          </thead>
          <tbody>
            ${printContent}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employeeBenefits.length
    ? employeeBenefits.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = Math.ceil(employeeBenefits.length / itemsPerPage);
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setModalPage(1);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const modalIndexOfLastItem = modalPage * modalItemsPerPage;
  const modalIndexOfFirstItem = modalIndexOfLastItem - modalItemsPerPage;
  const currentDeductions =
    selectedEmployee?.benefitDeductions?.slice(
      modalIndexOfFirstItem,
      modalIndexOfLastItem
    ) || [];

  const totalModalPages = Math.ceil(
    (selectedEmployee?.benefitDeductions.length || 0) / modalItemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const filteredEmployeeBenefits = employeeBenefits.filter((benefit) => {
    const fullName = `${benefit.userId?.firstName} ${benefit.userId?.lastName}`;
    return fullName.toLowerCase().includes(searchName.toLowerCase());
  });
  return (
    <div>
      <Header title="Benefits Employee Details" />
      <div className="flex justify-between mb-4">
  <input
    type="text"
    value={searchName}
    onChange={handleSearchChange}
    placeholder="Search by Employee Name"
    className="border p-2"
  />
  <button
    onClick={printPDF}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Print PDF
  </button>
</div>

      <div id="benefitTable">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Employee Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Benefit Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Front ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Back ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployeeBenefits.length > 0 ? (
              filteredEmployeeBenefits.map((benefit, index) => (
                <tr key={index} className="hover:bg-gray-300 hover:text-white">
                  <td className="px-6 py-4">
                    {benefit.userId?.lastName}, {benefit.userId?.firstName}
                  </td>
                  <td className="px-6 py-4">
                    {benefit.benefitId?.benefitName}
                  </td>
                  <td className="px-6 py-4">{benefit.status}</td>
                  <td className="px-6 py-4">
                    {benefit.uploadDocs?.frontId ? (
                      <a
                        href={benefit.uploadDocs.frontId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={benefit.uploadDocs.frontId}
                          alt="Front ID"
                          className="w-16 h-auto border rounded"
                        />
                      </a>
                    ) : (
                      "No Front ID"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {benefit.uploadDocs?.backId ? (
                      <a
                        href={benefit.uploadDocs.backId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={benefit.uploadDocs.backId}
                          alt="Back ID"
                          className="w-16 h-auto border rounded"
                        />
                      </a>
                    ) : (
                      "No Back ID"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(benefit.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => openModal(benefit)}
                    >
                      View Deductions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  No employee benefits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Benefit Deductions</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentDeductions.map((deduction) => (
                  <tr key={deduction._id}>
                    <td className="border p-2">{deduction.amount}</td>
                    <td className="border p-2">
                      {new Date(deduction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalModalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setModalPage(index + 1)}
                  className={`mx-1 px-3 py-1 border rounded ${
                    modalPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeBenefitsDetails;
