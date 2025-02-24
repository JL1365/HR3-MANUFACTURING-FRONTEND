import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function IncentiveTracking() {
    const [allIncentivesTracking, setIncentiveTracking] = useState([]);
    const [users, setUsers] = useState([]);
    const [incentives, setIncentives] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        incentiveId: "",
        amount: "",
        description: "",
        earnedDate: ""
    });
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
    
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/auth/get-all-users");
            setUsers(response.data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const fetchIncentives = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/incentive/get-all-incentives");
            setIncentives(response.data.allIncentives || []);
        } catch (error) {
            console.error("Error fetching incentives:", error);
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

    const handleEdit = (tracking) => {
        setFormData({
            _id: tracking._id,
            userId: tracking.userId?._id || "",
            incentiveId: tracking.incentiveId?._id || "",
            amount: tracking.amount || "",
            description: tracking.description || "",
            earnedDate: tracking.earnedDate || "",
        });
        fetchUsers();
        fetchIncentives();
        setIsOpenModal(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (formData._id) {
                await axios.put(
                    `http://localhost:7687/api/incentiveTracking/update-incentive-tracking/${formData._id}`, 
                    formData, 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                toast.success("Incentive tracking updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:7687/api/incentiveTracking/create-incentive-tracking",
                    formData, 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                toast.success("Incentive tracking created successfully!");
            }
            fetchIncentiveTracking();
            setIsOpenModal(false);  
        } catch (error) {
            console.error("Error saving incentive tracking:", error);
            toast.error("Failed to save incentive tracking!");
        }
    };
            
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                fetchUsers();
                fetchIncentives();
                setFormData({
                    userId: "",
                    incentiveId: "",
                    amount: "",
                    description: "",
                    earnedDate: ""
                });
                setIsOpenModal(true);
            }}
        >
            Create Incentive Tracking
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Received</th>
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
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{formatDate(tracking.earnedDate)}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{tracking.status}</td>
            <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{formatDate(tracking.dateReceived)}</td>
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

            {isOpenModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                    <h2 className="text-lg font-bold mb-4">
                    {formData._id ? "Edit Incentive Tracking" : "Create Incentive Tracking"}
                    </h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">Select User:</label>
                            <select
                                className="w-full p-2 border rounded mb-4"
                                value={formData.userId}
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                required
                            >
                                <option value="">-- Select User --</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-2">Select Incentive:</label>
                            <select
                                className="w-full p-2 border rounded mb-4"
                                value={formData.incentiveId}
                                onChange={(e) => setFormData({ ...formData, incentiveId: e.target.value })}
                                required
                            >
                                <option value="">-- Select Incentive --</option>
                                {incentives.map((incentive) => (
                                    <option key={incentive._id} value={incentive._id}>
                                        {incentive.incentiveName} ({incentive.incentiveType})
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-2">Amount:</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded mb-4"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />

                            <label className="block mb-2">Description:</label>
                            <textarea
                                className="w-full p-2 border rounded mb-4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />

                            <label className="block mb-2">Earned Date:</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded mb-4"
                                value={formData.earnedDate}
                                onChange={(e) => setFormData({ ...formData, earnedDate: e.target.value })}
                                required
                            />

                            <div className="flex justify-end">
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setIsOpenModal(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncentiveTracking;
