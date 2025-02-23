import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function MyDeductions() {
  const [myDeductions, setMyDeductions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const itemsPerPage = 10;
  const modalItemsPerPage = 5;

  useEffect(() => {
    fetchMyDeductions();
  }, []);

  const fetchMyDeductions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/benefitDeduction/get-my-deductions",
        { withCredentials: true }
      );
      if (response.data.deductions) {
        setMyDeductions(response.data.deductions);
      } else {
        toast.warn("No deductions found.");
      }
    } catch (error) {
      toast.error("Error fetching deductions.");
    }
  };

  const groupByBenefit = (deductions) => {
    return deductions.reduce((acc, deduction) => {
      const benefitName = deduction.BenefitRequestId?.benefitId?.benefitName || "Unknown Benefit";
      if (!acc[benefitName]) {
        acc[benefitName] = [];
      }
      acc[benefitName].push(deduction);
      return acc;
    }, {});
  };

  const groupedDeductions = groupByBenefit(myDeductions);
  const totalPages = Math.ceil(Object.keys(groupedDeductions).length / itemsPerPage);
  const paginatedBenefits = Object.entries(groupedDeductions).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-5">
      <Header title="Deductions Management" />
      <ToastContainer />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">My Benefit Deductions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBenefits.map(([benefitName, deductions]) => (
              <tr key={benefitName} className="hover:bg-gray-300 hover:text-white cursor-pointer" onClick={() => {
                setSelectedBenefit({ benefitName, deductions });
                setIsModalOpen(true);
                setModalPage(1);
              }}>
                <td className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-600">{benefitName}</td>
                <td className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  ₱{deductions.reduce((sum, deduction) => sum + deduction.amount, 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 mx-1 bg-gray-300 rounded">Previous</button>
          <span className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 mx-1 bg-gray-300 rounded">Next</button>
        </div>
      </div>

      {isModalOpen && selectedBenefit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">{selectedBenefit.benefitName}</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Deducted</th>
                </tr>
              </thead>
              <tbody>
                {selectedBenefit.deductions.slice((modalPage - 1) * modalItemsPerPage, modalPage * modalItemsPerPage).map((deduction) => (
                  <tr key={deduction._id}>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">₱{deduction.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{new Date(deduction.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <button disabled={modalPage === 1} onClick={() => setModalPage(modalPage - 1)} className="px-4 py-2 mx-1 bg-gray-300 rounded">Previous</button>
              <span className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Page {modalPage} of {Math.ceil(selectedBenefit.deductions.length / modalItemsPerPage)}</span>
              <button disabled={modalPage === Math.ceil(selectedBenefit.deductions.length / modalItemsPerPage)} onClick={() => setModalPage(modalPage + 1)} className="px-4 py-2 mx-1 bg-gray-300 rounded">Next</button>
            </div>

            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDeductions;
