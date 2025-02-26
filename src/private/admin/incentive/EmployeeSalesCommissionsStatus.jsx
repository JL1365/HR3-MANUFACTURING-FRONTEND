import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeSalesCommissionsStatus() {
    const [employeeSalesStatus, setEmployeeSalesStatus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllSalesCommissionsStatus();
    }, []);

    const fetchAllSalesCommissionsStatus = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/salesCommission/get-all-employee-sales-status", { withCredentials: true });
            setEmployeeSalesStatus(Array.isArray(response.data.employeeSalesStatus) ? response.data.employeeSalesStatus : []);
        } catch (error) {
            console.error("Error fetching Sales commission:", error);
            setEmployeeSalesStatus([]);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:7687/api/salesCommission/update-status/${id}`, { confirmationStatus: status }, { withCredentials: true });
            toast.success(`Status updated to ${status}`);
            fetchAllSalesCommissionsStatus();
        } catch (error) {
            toast.error("Failed to update status");
            console.error("Error updating status:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const indexOfLastSalesCommissions = currentPage * itemsPerPage;
    const indexOfFirstSalesCommissions = indexOfLastSalesCommissions - itemsPerPage;
    const currentSalesCommissions = employeeSalesStatus.slice(indexOfFirstSalesCommissions, indexOfLastSalesCommissions);
    const totalPages = Math.max(1, Math.ceil(employeeSalesStatus.length / itemsPerPage));

    return (
        <div>
            <ToastContainer />
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4">Employee Name</th>
                            <th className="px-6 py-4">Sales Status</th>
                            <th className="px-6 py-4">Total Sales</th>
                            <th className="px-6 py-4">Target Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalesCommissions.length > 0 ? (
                            currentSalesCommissions.map((commission) => (
                                <tr key={commission._id}>
                                    <td className="px-6 py-4">
                                        {commission.userId?.firstname} {commission.userId?.lastname}
                                    </td>
                                    <td className="px-6 py-4">{commission.salesStatus}</td>
                                    <td className="px-6 py-4">{commission.totalSales || "N/A"}</td>
                                    <td className="px-6 py-4">{commission.targetAmount || "N/A"}</td>
                                    <td className="px-6 py-4">{commission.confirmationStatus}</td>
                                    <td className="px-6 py-4">{formatDate(commission.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        {commission.confirmationStatus === "Pending" && (
                                            <>
                                                <button onClick={() => updateStatus(commission._id, "Approved")}
                                                    className="bg-green-500 text-white px-3 py-1 rounded mx-1">Approve</button>
                                                <button onClick={() => updateStatus(commission._id, "Rejected")}
                                                    className="bg-red-500 text-white px-3 py-1 rounded mx-1">Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center">No sales commissions found.</td>
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
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default EmployeeSalesCommissionsStatus;
