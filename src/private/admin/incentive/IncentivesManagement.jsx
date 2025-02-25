import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function IncentivesManagement() {
    const [allIncentives, setIncentives] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        incentiveName: "",
        incentiveDescription: "",
        incentiveType: "Others",
    });
    
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

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:7687/api/incentive/update-incentive/${editingItem}`, formData);
                toast.success("Incentive updated successfully!");
            } else {
                await axios.post("http://localhost:7687/api/incentive/create-incentive", formData);
                toast.success("Incentive created successfully!");
            }
            resetForm();
            fetchIncentives();
            setIsOpenModal(false);
        } catch (error) {
            console.error("Error saving incentive:", error.response ? error.response.data : error.message);
            toast.error("Error saving incentive: " + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleEdit = (incentive) => {
        setEditingItem(incentive._id);
        setFormData({
            incentiveName: incentive.incentiveName,
            incentiveDescription: incentive.incentiveDescription,
            incentiveType: incentive.incentiveType,
        });
        setIsEditing(true);
        setIsOpenModal(true);
    };

    const resetForm = () => {
        setFormData({
            incentiveName: "",
            incentiveDescription: "",
            incentiveType: "Others",
        });
        setEditingItem(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        toast.success("Item deleted successfully!");
        try {
            await axios.delete(`http://localhost:7687/api/incentive/delete-incentive/${id}`);
            setIncentives(allIncentives.filter((allIncentive) => allIncentive._id !== id));
        } catch (error) {
            toast.error("Failed to delete item");
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
            <Header title="Incentives Management" />
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

            {isOpenModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">{isEditing ? "Edit Incentive" : "Create Incentive"}</h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div>
                                <label>Incentive Name</label>
                                <input
                                    type="text"
                                    name="incentiveName"
                                    value={formData.incentiveName}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Incentive Description</label>
                                <input
                                    type="text"
                                    name="incentiveDescription"
                                    value={formData.incentiveDescription}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="incentiveType" className="block text-sm font-medium text-gray-700">Incentive Type:</label>
                                <select
                                    id="incentiveType"
                                    name="incentiveType"
                                    value={formData.incentiveType}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                    <option value="Others">Others</option>
                                    <option value="Performance-Based">Performance-Based</option>
                                    <option value="Attendance-Based">Attendance-Based</option>
                                    <option value="Safety and Compliance">Safety and Compliance</option>
                                    <option value="Tenure-Based">Tenure-Based</option>
                                    <option value="Skill Development">Skill Development</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Special Occasion">Special Occasion</option>
                                    <option value="Sales-Based">Sales-Based</option>
                                </select>
                            </div>
                            <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">{isEditing ? "Update" : "Create"}</button>
                            <button type="button" onClick={() => setIsOpenModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncentivesManagement;
