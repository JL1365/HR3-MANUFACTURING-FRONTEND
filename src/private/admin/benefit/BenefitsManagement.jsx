import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BenefitsManagement() {
    const [allBenefits, setBenefits] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        benefitName: "",
        benefitDescription: "",
        benefitType: "Others",
        isNeedRequest: false,
    });
    
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

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:7687/api/benefit/update-benefit/${editingItem}`, formData);
                toast.success("Benefit updated successfully!");
            } else {
                await axios.post("http://localhost:7687/api/benefit/create-benefit", formData);
                toast.success("Benefit created successfully!");
            }
            resetForm();
            fetchBenefits();
            setIsOpenModal(false);
        } catch (error) {
            console.error("Error saving benefit:", error.response ? error.response.data : error.message);
            toast.error("Error saving benefit: " + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleEdit = (benefit) => {
        setEditingItem(benefit._id);
        setFormData({
            benefitName: benefit.benefitName,
            benefitDescription: benefit.benefitDescription,
            benefitType: benefit.benefitType,
            isNeedRequest: benefit.isNeedRequest,
        });
        setIsEditing(true);
        setIsOpenModal(true);
    };

    const resetForm = () => {
        setFormData({
            benefitName: "",
            benefitDescription: "",
            benefitType: "Others",
            isNeedRequest: false,
        });
        setEditingItem(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        toast.success("Item deleted successfully!");
        try {
            await axios.delete(`http://localhost:7687/api/benefit/delete-benefit/${id}`);
            setBenefits(allBenefits.filter((allBenefit) => allBenefit._id !== id));
        } catch (error) {
            toast.error("Failed to delete item");
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
            <Header title="Benefits Management" />
            <ToastContainer />
            <button
                className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
                onClick={() => {
                    resetForm();
                    setIsOpenModal(true);
                }}
            >
                Create Benefit
            </button>

            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Is Need Request?</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
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
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(benefit)}>Edit</button>
                                        <button className="btn btn-error" onClick={() => handleDelete(benefit._id)}>Delete</button>
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
                        <h2 className="text-xl mb-4">{isEditing ? "Edit Benefit" : "Create Benefit"}</h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div>
                                <label>Benefit Name</label>
                                <input
                                    type="text"
                                    name="benefitName"
                                    value={formData.benefitName}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Benefit Description</label>
                                <input
                                    type="text"
                                    name="benefitDescription"
                                    value={formData.benefitDescription}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="benefitType" className="block text-sm font-medium text-gray-700">Benefit Type:</label>
                                <select
                                    id="benefitType"
                                    name="benefitType"
                                    value={formData.benefitType}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                    <option value="Others">Others</option>
                                    <option value="Compensation">Compensation</option>
                                    <option value="Health">Health</option>
                                    <option value="Financial">Financial</option>
                                </select>
                            </div>
                            <div>
                                <label>
                                    Is Need Request?
                                    <input
                                        type="checkbox"
                                        name="isNeedRequest"
                                        checked={formData.isNeedRequest}
                                        onChange={handleChange}
                                        className="ml-2"
                                    />
                                </label>
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

export default BenefitsManagement;
