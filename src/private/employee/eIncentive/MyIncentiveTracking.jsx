import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePageTracking from "../../../hooks/usePageTracking";

const TRACKING_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/incentiveTracking" 
: "https://backend-hr3.jjm-manufacturing.com/api/incentiveTracking";


function MyIncentivesTracking() {
     usePageTracking("Employee Incentives Tracking");
    const [myIncentivesTracking, setMyIncentivesTracking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMyIncentiveTracking();
    }, []);

    const fetchMyIncentiveTracking = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${TRACKING_URL}/get-my-incentives-tracking`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setMyIncentivesTracking(response.data.data || []);
        } catch (error) {
            console.error("Error fetching incentive tracking:", error);
        }
    };

    const markAsReceived = async (trackingId) => {
        const confirmAction = window.confirm("Are you sure you want to mark this incentive as received?");
        if (!confirmAction) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${TRACKING_URL}/update-my-incentive-tracking-status/${trackingId}`,
                { status: "Received" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success("Incentive marked as received!");
                fetchMyIncentiveTracking();
            } else {
                toast.error(response.data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to mark as received.");
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    // Pagination logic
    const indexOfLastIncentive = currentPage * itemsPerPage;
    const indexOfFirstIncentive = indexOfLastIncentive - itemsPerPage;
    const currentIncentives = myIncentivesTracking.slice(indexOfFirstIncentive, indexOfLastIncentive);
    const totalPages = Math.ceil(myIncentivesTracking.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Incentive Tracking" />
            <ToastContainer />

            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentive Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Earned Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Received</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIncentives.length > 0 ? (
                            currentIncentives.map((tracking) => (
                                <tr key={tracking._id} className="hover:bg-gray-300 hover:text-white">
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {tracking.incentiveId?.incentiveName || "Unknown"} ({tracking.incentiveId?.incentiveType || "N/A"})
                                    </td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {tracking.incentiveId?.amount || tracking.amount || 0}
                                    </td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {formatDate(tracking.earnedDate)}
                                    </td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {tracking.status}
                                    </td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {formatDate(tracking.dateReceived)}
                                    </td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        {tracking.status !== "Received" ? (
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={() => markAsReceived(tracking._id)}
                                            >
                                                Mark as Received
                                            </button>
                                        ) : (
                                            <span className="text-gray-500">Received</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MyIncentivesTracking;
