import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function DeductionManagement() {
  const [allRequestBenefit, setAllRequestBenefit] = useState([]);
  const [allDeductions, setAllDeductions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [amount, setAmount] = useState("");
  const [groupedDeductions, setGroupedDeductions] = useState({});
  const [selectedUserDeductions, setSelectedUserDeductions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isOpenModal, setisOpenModal] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [newAmount, setNewAmount] = useState("");
  const [modalPage, setModalPage] = useState(1);
  const modalItemsPerPage = 5;
  
  useEffect(() => {
    fetchAllAppliedRequests();
    fetchAllDeductions();
  }, []);

  const fetchAllAppliedRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/benefitRequest/get-all-applied-requests",
        { withCredentials: true }
      );
      if (response.data.allRequestBenefit) {
        setAllRequestBenefit(response.data.allRequestBenefit);
      } else {
        toast.warn("No benefit requests found.");
      }
    } catch (error) {
      toast.error("Error fetching benefit requests.");
    }
  };

  const fetchAllDeductions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/benefitDeduction/get-all-deductions",
        { withCredentials: true }
      );
      if (response.data.deductions) {
        setAllDeductions(response.data.deductions);
        groupDeductions(response.data.deductions);
      } else {
        toast.warn("No deductions found.");
      }
    } catch (error) {
      toast.error("Error fetching deductions.");
    }
  };

  const groupDeductions = (deductions) => {
    const grouped = deductions.reduce((acc, deduction) => {
      const userId = deduction.userId._id;
      if (!acc[userId]) {
        acc[userId] = {
          user: deduction.userId,
          deductions: [],
        };
      }
      acc[userId].deductions.push(deduction);
      return acc;
    }, {});
    setGroupedDeductions(grouped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBenefit || !amount || isNaN(amount)) {
      toast.error("Please provide valid inputs.");
      return;
    }

    const request = allRequestBenefit.find(
      (req) =>
        req.userId._id === selectedUser && req.benefitId._id === selectedBenefit
    );

    if (!request || request.status !== "Approved") {
      toast.error("Selected benefit request is not approved.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7687/api/benefitDeduction/add-user-deduction",
        {
          userId: selectedUser,
          benefitRequestId: request._id,
          amount: parseFloat(amount),
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setSelectedUser("");
      setSelectedBenefit("");
      setAmount("");
      fetchAllDeductions();
    } catch (error) {
      toast.error("Error adding deduction.");
    }
  };

  const totalPages = Math.ceil(
    Object.keys(groupedDeductions).length / itemsPerPage
  );
  const paginatedDeductions = Object.values(groupedDeductions).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateDeduction = async () => {
    if (!editingDeduction || !newAmount || isNaN(newAmount)) {
      toast.error("Please enter a valid amount.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:7687/api/benefitDeduction/update-user-deduction/${editingDeduction._id}`,
        { amount: parseFloat(newAmount) },
        { withCredentials: true }
      );
  
      toast.success(response.data.message);
  
      setSelectedUserDeductions((prev) =>
        prev.map((deduction) =>
          deduction._id === editingDeduction._id
            ? { ...deduction, amount: parseFloat(newAmount) }
            : deduction
        )
      );
  
      setEditingDeduction(null);
      setNewAmount("");
      fetchAllDeductions();
    } catch (error) {
      toast.error("Error updating deduction.");
    }
  };
  

  return (
    <div className="p-5">
      <Header title="Deductions Management" />
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          setisOpenModal(true);
        }}
      >
        Add new Deduction
      </button>

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider w-full"
              >
                <option value="">Select User</option>
                {[
                  ...new Set(allRequestBenefit.map((req) => req.userId._id)),
                ].map((userId) => {
                  const user = allRequestBenefit.find(
                    (req) => req.userId._id === userId
                  )?.userId;
                  return (
                    <option key={userId} value={userId}>
                      {user.firstName} {user.lastName}
                    </option>
                  );
                })}
              </select>

              <select
                value={selectedBenefit}
                onChange={(e) => setSelectedBenefit(e.target.value)}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider w-full"
                disabled={!selectedUser}
              >
                <option value="">Select Benefit</option>
                {allRequestBenefit
                  .filter((req) => req.userId._id === selectedUser)
                  .map((req) => (
                    <option key={req.benefitId._id} value={req.benefitId._id}>
                      {req.benefitId.benefitName}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                placeholder="Enter Deduction Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider w-full"
                disabled={!selectedBenefit}
              />

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Deduction
              </button>
              <button type="button" onClick={() => setisOpenModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
            </form>
          </div>
        </div>
      )}
      {/* Deductions Table */}
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                User Name
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDeductions.map(({ user, deductions }) => (
              <tr key={user._id} className="hover:bg-gray-300 hover:text-white">
                <td
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer text-blue-600"
                  onClick={() => setSelectedUserDeductions(deductions)}
                >
                  {user.firstName} {user.lastName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for showing deductions */}
      {selectedUserDeductions && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-5 rounded w-1/2">
      <h2 className="text-xl font-semibold mb-4">Deductions Details</h2>

      {/* Modal Pagination Logic */}
      {(() => {
        const modalTotalPages = Math.ceil(selectedUserDeductions.length / modalItemsPerPage);
        const paginatedModalDeductions = selectedUserDeductions.slice(
          (modalPage - 1) * modalItemsPerPage,
          modalPage * modalItemsPerPage
        );

        return (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedModalDeductions.map((deduction) => (
                  <tr key={deduction._id} className="hover:bg-gray-300 hover:text-white">
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {deduction.BenefitRequestId?.benefitId?.benefitName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      ₱{deduction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {new Date(deduction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => setEditingDeduction(deduction)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                disabled={modalPage === 1}
                onClick={() => setModalPage(modalPage - 1)}
                className="px-4 py-2 mx-1 bg-gray-300 rounded"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {modalPage} of {modalTotalPages}
              </span>
              <button
                disabled={modalPage === modalTotalPages}
                onClick={() => setModalPage(modalPage + 1)}
                className="px-4 py-2 mx-1 bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </>
        );
      })()}

      <button
        className="bg-red-500 text-white p-2 rounded mt-4"
        onClick={() => {
          setSelectedUserDeductions(null);
          setModalPage(1);
        }}
      >
        Close
      </button>
    </div>
  </div>
)}


{editingDeduction && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-5 rounded w-1/3">
      <h2 className="text-xl font-semibold mb-4">Update Deduction</h2>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          className="bg-green-500 text-white p-2 rounded mr-2"
          onClick={handleUpdateDeduction}
        >
          Update
        </button>
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={() => setEditingDeduction(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default DeductionManagement;
