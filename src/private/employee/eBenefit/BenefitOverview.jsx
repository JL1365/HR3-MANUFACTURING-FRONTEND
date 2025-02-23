import React, { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../../components/Header";

function BenefitOverview() {
    const [allBenefits, setBenefits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBenefits();
    }, []);

    const fetchBenefits = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/benefit/get-all-benefits");
            setBenefits(response.data.allBenefits || []);
        } catch (error) {
            console.error("Error fetching benefits:", error);
        }
    };


    // Pagination logic
    const indexOfLastBenefit = currentPage * itemsPerPage;
    const indexOfFirstBenefit = indexOfLastBenefit - itemsPerPage;
    const currentBenefits = allBenefits.slice(indexOfFirstBenefit, indexOfLastBenefit);
    const totalPages = Math.ceil(allBenefits.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Benefits Overview" />
            <ToastContainer />

            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Is Need Request?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBenefits.length > 0 ? (
                            currentBenefits.map((benefit) => (
                                <tr key={benefit._id} className="hover:bg-gray-300 hover:text-white">
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitName}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitDescription}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitType}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.isNeedRequest ? "Yes" : "No"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">No items found.</td>
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

export default BenefitOverview;
