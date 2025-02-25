import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SalesCommission() {
    const [allSalesCommissions, setSalesCommission] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        salesCommissionName: "",
        targetAmount:0,
        commissionRate: 0,
        status:""
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSalesCommission();
    }, []);

    const fetchSalesCommission = async () => {
        try {
            const response = await axios.get("http://localhost:7687/api/salesCommission/get-all-sales-commission");
            console.log(response.data)
            setSalesCommission(response.data || []);
        } catch (error) {
            console.error("Error fetching Sales commission:", error);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:7687/api/salesCommission/update-sales-commission/${editingItem}`, formData);
                toast.success("Sales commission updated successfully!");
            } else {
                await axios.post("http://localhost:7687/api/salesCommission/create-sales-commission", formData);
                toast.success("Sales Commission created successfully!");
            }
            resetForm();
            fetchSalesCommission();
            setIsOpenModal(false);
        } catch (error) {
            console.error("Error saving sales commission:", error.response ? error.response.data : error.message);
            toast.error("Error saving sales commission: " + (error.response ? error.response.data.message : error.message));
        }
    };

/*     const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }; */

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    

    const handleEdit = (commision) => {
        setEditingItem(commision._id);
        setFormData({
            salesCommissionName: commision.salesCommissionName,
            targetAmount: commision.targetAmount,
            commissionRate: commision.commissionRate,
            status: commision.status,
        });
        setIsEditing(true);
        setIsOpenModal(true);
    };

    const resetForm = () => {
        setFormData({
            salesCommissionName: "",
            targetAmount: 0,
            commissionRate:0,
            status:""
        });
        setEditingItem(null);
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        toast.success("Item deleted successfully!");
        try {
            await axios.delete(`http://localhost:7687/api/salesCommission/delete-sales-commission/${id}`);
            setSalesCommission(allSalesCommissions.filter((allCommission) => allCommission._id !== id));
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

    // Pagination logic
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
            <button
                className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
                onClick={() => {
                    resetForm();
                    setIsOpenModal(true);
                }}
            >
                Create Sales Commission
            </button>

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
                            currentSalesCommissions.map((commission) => (
                                <tr key={commission._id} className="hover:bg-gray-300 hover:text-white">
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{commission.salesCommissionName}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{commission.targetAmount}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{commission.commissionRate}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{formatDate(commission.createdAt)}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{commission.status}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(commission)}>Edit</button>
                                        <button className="btn btn-error" onClick={() => handleDelete(commission._id)}>Delete</button>
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
                        <h2 className="text-xl mb-4">{isEditing ? "Edit Sales commission" : "Create Sales commission"}</h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div>
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="Not Available">Not Available</option>
                                <option value="Available">Available</option>
                                </select>
                            </div>
                            <div>
                                <label>Commission Name</label>
                                <input
                                    type="text"
                                    name="salesCommissionName"
                                    value={formData.salesCommissionName}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Target Amount</label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div>
                                <label>Commission Rate</label>
                                <input
                                    type="number"
                                    name="commissionRate"
                                    value={formData.commissionRate}
                                    onChange={handleChange}
                                    required
                                    className="border p-2 w-full"
                                />
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

export default SalesCommission;
