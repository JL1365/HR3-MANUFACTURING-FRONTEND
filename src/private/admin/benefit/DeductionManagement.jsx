import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

const DEDUCTIONS_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/benefitDeduction" 
  : "https://backend-hr3.jjm-manufacturing.com/api/benefitDeduction";

  const BENEFIT_REQUESTED_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/benefitRequest" 
  : "https://backend-hr3.jjm-manufacturing.com/api/benefitRequest";

  const COMPENSATION_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/compensation" 
  : "https://backend-hr3.jjm-manufacturing.com/api/compensation";


function DeductionManagement() {
  const [updatedRequestBenefit, setUpdatedRequestBenefit] = useState([]);
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
  const [benefitsData, setBenefitsData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(""); 
  const [selectedBenefits, setSelectedBenefits] = useState([]); 
  useEffect(() => {
    fetchAllAppliedRequests();
    fetchAllDeductions();
  }, []);

  const fetchAllAppliedRequests = async () => {
    try {
      const response = await axios.get(
        `${BENEFIT_REQUESTED_URL}/get-all-applied-requests`,
        { withCredentials: true }
      );
      console.log(
        "Fetched Benefit Requests: ",
        response.data.updatedRequestBenefit
      );
      if (response.data.updatedRequestBenefit) {
        setUpdatedRequestBenefit(response.data.updatedRequestBenefit);
      } else {
        console.log("No benefit requests found.");
      }
    } catch (error) {
      console.log("Error fetching benefit requests.");
    }
  };

  const fetchAllDeductions = async () => {
    try {
      const response = await axios.get(
        `${DEDUCTIONS_URL}/get-all-deductions`,
        { withCredentials: true }
      );
      console.log("Fetched Deductions: ", response.data);
      
      if (response.data.deductions && response.data.deductions.length > 0) {
        console.log("First deduction structure:", response.data.deductions[0]);
        setAllDeductions(response.data.deductions);
        groupDeductions(response.data.deductions);
      } else {
        console.warn("No deductions found or empty array returned");
      }
    } catch (error) {
      console.error("Error details:", error); 
    }
  };

  useEffect(() => {
    const fetchBenefitsAndDeductions = async () => {
        try {
            const response = await axios.get(`${COMPENSATION_URL}/get-benefits-and-deductions`);
            if (response.data.success) {
                setBenefitsData(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchBenefitsAndDeductions();
}, []);

const handleSelectChange = (event) => {
  const position = event.target.value;
  setSelectedPosition(position);

  // Hanapin ang benefits ng napiling position
  const selected = benefitsData.find((plan) => plan.positionName === position);
  setSelectedBenefits(selected ? selected.benefits : []);
};

const groupDeductions = (deductions) => {
  const grouped = deductions.reduce((acc, deduction) => {
    // Check if user property exists and has the expected structure
    if (!deduction.user) {
      console.log("Missing user data for deduction:", deduction);
      return acc;
    }
    
    const userId = deduction.userId; // This should be the string ID
    
    if (!acc[userId]) {
      acc[userId] = {
        user: deduction.user, // Use the user object returned from API
        deductions: [],
      };
    }
    
    acc[userId].deductions.push(deduction);
    return acc;
  }, {});
  
  setGroupedDeductions(grouped);
  console.log("Grouped deductions:", grouped); // Debug log
};
  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (!selectedUser || !selectedBenefit || !amount || isNaN(amount)) {
      toast.error("Please provide valid inputs.");
      return;
    }

    console.log("Selected User:", selectedUser);
    console.log("Selected Benefit:", selectedBenefit);
    console.log("Updated Request Benefit:", updatedRequestBenefit);

    const request = updatedRequestBenefit.find(
      (req) =>
        req.userId === selectedUser && 
        req.benefitId._id === selectedBenefit 
    );

    console.log("Selected Request:", request);

    if (!request) {
      toast.error("Selected benefit request not found.");
      return;
    }

    if (request.status !== "Approved") {
      toast.error("Selected benefit request is not approved.");
      return;
    }

    // Make the API request to add the deduction
    try {
      const response = await axios.post(
        `${DEDUCTIONS_URL}/add-user-deduction`,
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
        `${DEDUCTIONS_URL}/update-user-deduction/${editingDeduction._id}`,
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
    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdowns in One Line */}
        <div className="flex gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 text-xs font-semibold text-neutral uppercase tracking-wider w-full border rounded"
          >
            <option value="">Select User</option>
            {[
              ...new Set(updatedRequestBenefit.map((req) => req.userId)),
            ].map((userId) => {
              const user = updatedRequestBenefit.find(
                (req) => req.userId === userId
              )?.user;

              return (
                <option key={userId} value={userId}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName} ${user.position}`
                    : "Unknown User"}
                </option>
              );
            })}
          </select>

          <select
            value={selectedBenefit}
            onChange={(e) => setSelectedBenefit(e.target.value)}
            className="px-4 py-2 text-xs font-semibold text-neutral uppercase tracking-wider w-full border rounded"
            disabled={!selectedUser}
          >
            <option value="">Select Benefit</option>
            {updatedRequestBenefit
              .filter((req) => req.userId === selectedUser)
              .map((req) => (
                <option key={req.benefitId._id} value={req.benefitId._id}>
                  {req.benefitId?.benefitName || "Unknown Benefit"}
                </option>
              ))}
          </select>

          <select
            onChange={handleSelectChange}
            value={selectedPosition}
            className="px-4 py-2 text-xs font-semibold text-neutral uppercase tracking-wider w-full border rounded"
          >
            <option value="">-- Select Position --</option>
            {benefitsData.map((plan, index) => (
              <option key={index} value={plan.positionName}>
                {plan.positionName}
              </option>
            ))}
          </select>
        </div>

        {/* Display Benefits Based on Selected Position */}
        {selectedPosition && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-sm font-semibold">
              Benefits for {selectedPosition}
            </h3>
            {selectedBenefits.length > 0 ? (
              <ul className="list-disc pl-4 text-xs">
                {selectedBenefits.map((benefit, i) => (
                  <li key={i}>
                    {benefit.benefitType.toUpperCase()} - Deduction: ₱
                    {benefit.deductionsAmount.toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-600">No benefits assigned.</p>
            )}
          </div>
        )}

        {/* Input for Deduction Amount */}
        <input
          type="number"
          placeholder="Enter Deduction Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 text-xs font-semibold text-neutral uppercase tracking-wider w-full border rounded"
          disabled={!selectedBenefit}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Deduction
          </button>
          <button
            type="button"
            onClick={() => setisOpenModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
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
              const modalTotalPages = Math.ceil(
                selectedUserDeductions.length / modalItemsPerPage
              );
              const paginatedModalDeductions = selectedUserDeductions.slice(
                (modalPage - 1) * modalItemsPerPage,
                modalPage * modalItemsPerPage
              );

              return (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                          Benefit Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedModalDeductions.map((deduction) => (
                        <tr
                          key={deduction._id}
                          className="hover:bg-gray-300 hover:text-white"
                        >
                          <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                            {deduction.BenefitRequestId?.benefitId
                              ?.benefitName || "N/A"}
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
