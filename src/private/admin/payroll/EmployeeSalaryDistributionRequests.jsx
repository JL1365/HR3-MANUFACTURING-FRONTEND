import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function EmployeeSalaryDistributionRequests() {
    const [allSalaryDistributionRequests, setAllSalaryDistributionRequests] = useState([]);
    const [isRequestAvailable, setIsRequestAvailable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllSalaryDistributionRequests();
    }, []);

    const fetchAllSalaryDistributionRequests = async () => {
        try {
            const response = await axios.get(
                "http://localhost:7687/api/salaryRequest/get-all-salary-distribution-requests",
                { withCredentials: true }
            );
            if (response.data.success) {
                setAllSalaryDistributionRequests(response.data.data);
            } else {
                toast.warn("No salary requests found.");
                setAllSalaryDistributionRequests([]);
            }
        } catch (error) {
            toast.error("Error fetching salary requests: " + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleReviewRequest = async (requestId, action) => {
        try {
            const response = await axios.put(
                `http://localhost:7687/api/salaryRequest/review-salary-distribution-request/${requestId}`,
                { action },
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success("Request updated successfully.");
                fetchAllSalaryDistributionRequests();
            }
        } catch (error) {
            toast.error("Error updating request: " + (error.response ? error.response.data.message : error.message));
        }
    };
    const toggleRequestAvailability = async () => {
        try {
            const response = await axios.put("http://localhost:7687/api/salaryRequest/toggle-request-availability", {}, { withCredentials: true });
            toast.success(response.data.message);
            setIsRequestAvailable(!isRequestAvailable);
        } catch (error) {
            toast.error("Error toggling request availability: " + (error.response ? error.response.data.message : error.message));
        }
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    const currentRequests = allSalaryDistributionRequests.slice(indexOfFirstRequest, indexOfLastRequest);
    const totalPages = Math.ceil(allSalaryDistributionRequests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Salary Distribution Requests" />
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Salary Requests</h2>
                <button
                    onClick={toggleRequestAvailability}
                    className={`px-4 py-2 text-white font-semibold rounded ${isRequestAvailable ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {isRequestAvailable ? "Disable Salary Requests" : "Enable Salary Requests"}
                </button>
            </div>
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Employee Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Payment Method</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">GCash Number</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date Requested</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentRequests.length > 0 ? (
                        currentRequests.map((request) => (
                        <tr key={request._id} className="bg-white border-b">
                            <td className="px-6 py-4 whitespace-nowrap">
                            {request.userId?.firstName} {request.userId?.lastName}
                            </td>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                            {request.status === "Pending" && (
                                <>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => handleReviewRequest(request._id, "approved")}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleReviewRequest(request._id, "rejected")}
                                >
                                    Reject
                                </button>
                                </>
                            )}
                            </td>
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
        </div>
    );
}

export default EmployeeSalaryDistributionRequests;
