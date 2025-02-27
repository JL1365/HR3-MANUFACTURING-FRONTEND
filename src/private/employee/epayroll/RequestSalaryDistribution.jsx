import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function RequestSalaryDistribution() {
    const [mySalaryDistributionRequests, setMySalaryDistributionRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [gCashNumber, setGCashNumber] = useState("");
    const itemsPerPage = 10;

  useEffect(() => {
    fetchMySalaryDistributionRequests();
  }, []);

  const fetchMySalaryDistributionRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/salaryRequest/get-my-salary-distribution-requests",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMySalaryDistributionRequests(response.data.data);
      } else {
        toast.warn("No salary requests found.");
        setMySalaryDistributionRequests([]);
      }
    } catch (error) {
      toast.error(
        "Error fetching salary requests: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const requestSalaryDistribution = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7687/api/salaryRequest/request-salary-distribution",
        { paymentMethod, gCashNumber },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchMySalaryDistributionRequests();
      setIsOpenModal(false);
    } catch (error) {
      toast.error(
        "Error requesting salary: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  const resetForm = () => {
    setPaymentMethod("Cash");
    setGCashNumber("");
  };
  
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = mySalaryDistributionRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(mySalaryDistributionRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Salary Distribution Requests" />
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Request Salary Distribution
      </button>
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Payment Method</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">GCash Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date Requested</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
                currentRequests.map((request) => (
                <tr key={request._id} className="bg-white border-b">
                    <td className="px-6 py-4 whitespace-nowrap">{request.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.gCashNumber || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {request.status === "Pending" ? (
                        <span className="text-yellow-500">{request.status}</span>
                    ) : request.status === "Approved" ? (
                        <span className="text-green-500">{request.status}</span>
                    ) : (
                        <span className="text-red-500">{request.status}</span>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.createdAt)}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                    No salary distribution requests found.
                </td>
                </tr>
            )}
            </tbody>

        </table>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Request Salary Distribution</h2>
            <label className="block mb-2">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 w-full mb-4"
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
            </select>

            {paymentMethod === "GCash" && (
              <div>
                <label className="block mb-2">GCash Number:</label>
                <input
                  type="number"
                  value={gCashNumber}
                  onChange={(e) => setGCashNumber(e.target.value)}
                  className="border p-2 w-full mb-4"
                  placeholder="Enter GCash Number"
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={requestSalaryDistribution}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestSalaryDistribution;
