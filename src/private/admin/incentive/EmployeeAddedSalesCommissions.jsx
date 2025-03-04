import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SALES_COMMISSION_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/salesCommission" 
  : "https://backend-hr3.jjm-manufacturing.com/api/salesCommission";


function EmployeeAddedSalesCommissions() {
    const [addedSales, setAddedSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllAddedSalesCommissions();
    }, []);

    const fetchAllAddedSalesCommissions = async () => {
        try {
            const response = await axios.get(`${SALES_COMMISSION_URL}/get-all-added-sales-commission`, { withCredentials: true });
            setAddedSales(Array.isArray(response.data.addedSales) ? response.data.addedSales : []);
        } catch (error) {
            console.error("Error fetching Sales commission:", error);
            setAddedSales([]);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await axios.put(`${SALES_COMMISSION_URL}/update-confirmation-status/${id}`,
                { confirmationStatus: status },
                { withCredentials: true }
            );
            toast.success(response.data.message);
            fetchAllAddedSalesCommissions(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const indexOfLastSalesCommissions = currentPage * itemsPerPage;
    const indexOfFirstSalesCommissions = indexOfLastSalesCommissions - itemsPerPage;
    const currentSalesCommissions = addedSales.slice(indexOfFirstSalesCommissions, indexOfLastSalesCommissions);
    const totalPages = Math.max(1, Math.ceil(addedSales.length / itemsPerPage));

    return (
        <div>
            <ToastContainer />
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4">Employee Name</th>
                            <th className="px-6 py-4">Commission Name</th>
                            <th className="px-6 py-4">Sales Proof</th>
                            <th className="px-6 py-4">Sales Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalesCommissions.length > 0 ? (
                            currentSalesCommissions.map((commission) => (
                                <tr key={commission._id}>
                                    <td className="px-6 py-4">{commission.userId?.firstName} {commission.userId?.lastName}</td>
                                    <td className="px-6 py-4">{commission.salesCommissionId?.salesCommissionName}</td>

                                    <td className="px-6 py-4">
                                {commission.salesProof && commission.salesProof.length > 0 ? (
                                    <a href={commission.salesProof[0].url} target="_blank" rel="noopener noreferrer">
                                        <img 
                                            src={commission.salesProof[0].url} 
                                            alt="Sales Proof" 
                                            className="w-16 h-16 object-cover rounded-md border border-gray-300 hover:opacity-80 cursor-pointer"
                                        />
                                    </a>
                                ) : (
                                    "No Proof"
                                )}
                            </td>
                                    <td className="px-6 py-4">{commission.salesAmount}</td>
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

export default EmployeeAddedSalesCommissions;
