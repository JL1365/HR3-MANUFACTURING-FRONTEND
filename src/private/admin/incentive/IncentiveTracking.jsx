import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function IncentiveTracking() {
    const [allIncentivesTracking, setIncentiveTracking] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchIncentiveTracking();
    }, []);

    const fetchIncentiveTracking = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/incentiveTracking/get-all-incentive-tracking");
            console.log(response.data);
            setIncentiveTracking(response.data.allIncentivesTracking || []);
        } catch (error) {
            console.error("Error fetching incentive Tracking:", error);
        }
    };
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        toast.success("Item deleted successfully!");
        try {
            await axios.delete(`http://localhost:7687/api/incentiveTracking/delete-incentive-tracking/${id}`);
            setIncentiveTracking(allIncentivesTracking.filter((allIncentiveTrack) => allIncentiveTrack._id !== id));
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    // Pagination logic
    const indexOfLastIncentive = currentPage * itemsPerPage;
    const indexOfFirstIncentive = indexOfLastIncentive - itemsPerPage;
    const currentIncentives = allIncentivesTracking.slice(indexOfFirstIncentive, indexOfLastIncentive);
    const totalPages = Math.ceil(allIncentivesTracking.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header title="Incentive Tracking" />
            <ToastContainer />
            <button
                className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
                onClick={() => {
                    resetForm();
                    setIsOpenModal(true);
                }}
            >
                Create Incentive
            </button>

            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Incentive Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Earned Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Given</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
<tbody>
{currentIncentives.length > 0 ? (
    currentIncentives.map((tracking) => (
        <tr key={tracking._id} className="hover:bg-gray-300 hover:text-white">
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                {tracking.userId?.firstName} {tracking.userId?.lastName}
            </td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                {tracking.incentiveId?.incentiveName} ({tracking.incentiveId?.incentiveType})
            </td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{tracking.amount}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{tracking.earnedDate}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{tracking.status}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{tracking.dateGiven}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                <button className="btn btn-primary mr-2" onClick={() => handleEdit(tracking)}>Edit</button>
                <button className="btn btn-error" onClick={() => handleDelete(tracking._id)}>Delete</button>
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

export default IncentiveTracking;
