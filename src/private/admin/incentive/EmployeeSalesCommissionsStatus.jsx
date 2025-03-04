import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SALES_COMMISSION_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/salesCommission" 
  : "https://backend-hr3.jjm-manufacturing.com/api/salesCommission";

function EmployeeSalesCommissionsStatus() {
    const [employeeSalesStatus, setEmployeeSalesStatus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAllSalesCommissionsStatus();
    }, []);

    const fetchAllSalesCommissionsStatus = async () => {
        try {
            const response = await axios.get(`${SALES_COMMISSION_URL}/get-all-employee-sales-status`, { withCredentials: true });
            setEmployeeSalesStatus(Array.isArray(response.data.employeeSalesStatus) ? response.data.employeeSalesStatus : []);
        } catch (error) {
            console.error("Error fetching Sales commission:", error);
            setEmployeeSalesStatus([]);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${SALES_COMMISSION_URL}/update-status/${id}`, { confirmationStatus: status }, { withCredentials: true });
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
      
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-4 border">Employee Name</th>
                            <th className="px-6 py-4 border">Sales Status</th>
                            <th className="px-6 py-4 border">Total Sales</th>
                            <th className="px-6 py-4 border">Target Amount</th>
                            <th className="px-6 py-4 border">Status</th>
                            <th className="px-6 py-4 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalesCommissions.length > 0 ? (
                            currentSalesCommissions.map((commission) => (
                                <tr key={commission._id} className="border-t">
                                    <td className="px-6 py-4 border">
                                        {commission.userId?.firstName} {commission.userId?.lastName}
                                    </td>
                                    <td className="px-6 py-4 border">{commission.salesStatus || "N/A"}</td>
                                    <td className="px-6 py-4 border">{commission.totalSales || "N/A"}</td>
                                    <td className="px-6 py-4 border">{commission.salesCommissionId?.targetAmount || "N/A"}</td>
                                    <td className="px-6 py-4 border">{commission.totalSales}</td>
                                    <td className="px-6 py-4 border">{formatDate(commission.createdAt)}</td>
                                   
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center border">No sales commissions found.</td>
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
