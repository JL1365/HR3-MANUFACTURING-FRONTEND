import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MySalesCommissionStatus from "./MySalesCommissionStatus";
import MyAddedSalesCommission from "./MyAddedSalesCommission";

function MySalesCommission() {
    const { user } = useOutletContext();
    const [allSalesCommissions, setSalesCommission] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSalesCommission();
    }, []);
    
    const fetchSalesCommission = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/salesCommission/get-all-sales-commission", { withCredentials: true });
            console.log("Fetched Sales Commissions:", response.data);
            setSalesCommission(response.data || []);
        } catch (error) {
            console.error("Error fetching Sales commission:", error);
        }
    };

    const handleAssign = async (salesCommissionId) => {
        try {
            await axios.post("http://localhost:7687/api/salesCommission/assign-sales-commission", {
                salesCommissionId
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            toast.success("Sales commission assigned successfully!");

            setSalesCommission(prev => prev.map(commission =>
                commission._id === salesCommissionId
                    ? { ...commission, assignedTo: [...(commission.assignedTo || []), { userId: user._id, assignStatus: "Assigned" }] }
                    : commission
            ));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign sales commission");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastSalesCommissions = currentPage * itemsPerPage;
    const indexOfFirstSalesCommissions = indexOfLastSalesCommissions - itemsPerPage;
    const currentSalesCommissions = allSalesCommissions.slice(indexOfFirstSalesCommissions, indexOfLastSalesCommissions);
    const totalPages = Math.ceil(allSalesCommissions.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Sales Commission" />
            <ToastContainer />
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Commission Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Target Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Commission Rate</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalesCommissions.length > 0 ? (
                            currentSalesCommissions.map((commission) => {
                                const isAssigned = user && commission.assignedTo?.some(assigned => assigned.userId === user._id && assigned.assignStatus === "Assigned");

                                return (
                                    <tr key={commission._id} className="hover:bg-gray-300 hover:text-white">
                                        <td className="px-6 py-4">{commission.salesCommissionName}</td>
                                        <td className="px-6 py-4">{commission.targetAmount}</td>
                                        <td className="px-6 py-4">{commission.commissionRate}</td>
                                        <td className="px-6 py-4">{formatDate(commission.createdAt)}</td>
                                        <td className="px-6 py-4">{commission.status}</td>
                                        <td className="px-6 py-4">
                                            {isAssigned ? (
                                                <span className="text-green-600 font-bold">Assigned</span>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleAssign(commission._id)}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
            <MySalesCommissionStatus />
            <MyAddedSalesCommission />
        </div>
    );
}

export default MySalesCommission;
