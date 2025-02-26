import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

function MyAddedSalesCommission() {
    const { user } = useOutletContext();
    const [myAddedSales, setMyAddedSales] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (user?._id) {
            fetchMyAddedSalesCommissions(user._id);
        }
    }, [user]);

    const fetchMyAddedSalesCommissions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:7687/api/salesCommission/get-my-added-sales-commissions",
                { withCredentials: true }
            );
            setMyAddedSales(response.data.myAddedSales || []);
        } catch (error) {
            console.error("Error fetching added sales commissions:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const indexOfLastSales = currentPage * itemsPerPage;
    const indexOfFirstSales = indexOfLastSales - itemsPerPage;
    const currentSales = myAddedSales.slice(indexOfFirstSales, indexOfLastSales);
    const totalPages = Math.ceil(myAddedSales.length / itemsPerPage);

    return (
        <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {[
                            "Commission Name",
                            "Target Amount",
                            "Commission Rate",
                            "Sales Amount",
                            "Proof",
                            "Status",
                            "Date",
                        ].map((header) => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentSales.length > 0 ? (
                        currentSales.map((sale) => (
                            <tr key={sale._id} className="hover:bg-gray-300 hover:text-white">
                                <td className="px-6 py-4 text-gray-700">{sale.salesCommissionId?.salesCommissionName || "N/A"}</td>
                                <td className="px-6 py-4 text-gray-700">{sale.salesCommissionId?.targetAmount || 0}</td>
                                <td className="px-6 py-4 text-gray-700">{sale.salesCommissionId?.commissionRate || 0}%</td>
                                <td className="px-6 py-4 text-gray-700">{sale.salesAmount || 0}</td>
                                <td className="px-6 py-4">
                                {sale.salesProof && sale.salesProof.length > 0 ? (
                                    <a href={sale.salesProof[0].url} target="_blank" rel="noopener noreferrer">
                                        <img 
                                            src={sale.salesProof[0].url} 
                                            alt="Sales Proof" 
                                            className="w-16 h-16 object-cover rounded-md border border-gray-300 hover:opacity-80 cursor-pointer"
                                        />
                                    </a>
                                ) : (
                                    "No Proof"
                                )}
                            </td>


                                <td className="px-6 py-4 font-semibold">{sale.confirmationStatus}</td>
                                <td className="px-6 py-4 text-gray-700">{formatDate(sale.createdAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                No added sales found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${
                            currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MyAddedSalesCommission;
