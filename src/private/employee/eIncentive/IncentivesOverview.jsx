import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../../components/Header";

function IncentivesOverview() {
    const [allIncentives, setIncentives] = useState([]);    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchIncentives();
    }, []);

    const fetchIncentives = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/incentive/get-all-incentives");
            setIncentives(response.data.allIncentives || []);
        } catch (error) {
            console.error("Error fetching incentives:", error);
        }
    };

    // Pagination logic
    const indexOfLastIncentive = currentPage * itemsPerPage;
    const indexOfFirstIncentive = indexOfLastIncentive - itemsPerPage;
    const currentIncentives = allIncentives.slice(indexOfFirstIncentive, indexOfLastIncentive);
    const totalPages = Math.ceil(allIncentives.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Incentives Overview" />
            <ToastContainer />
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentive Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentive Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentive Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIncentives.length > 0 ? (
                            currentIncentives.map((incentive) => (
                                <tr key={incentive._id} className="hover:bg-gray-300 hover:text-white">
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{incentive.incentiveName}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{incentive.incentiveDescription}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{incentive.incentiveType}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(incentive)}>Edit</button>
                                        <button className="btn btn-error" onClick={() => handleDelete(incentive._id)}>Delete</button>
                                    </td>
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

export default IncentivesOverview;
