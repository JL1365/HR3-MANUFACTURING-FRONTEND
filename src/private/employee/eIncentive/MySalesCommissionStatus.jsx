import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MySalesCommissionStatus() {
    const { user } = useOutletContext();
    const [myCommissions, setMySalesCommissionStatus] = useState([]);
    const [assignedCommissions, setSalesCommissionList] = useState([]);
    const [selectedCommission, setSelectedCommission] = useState("");
    const [salesAmount, setSalesAmount] = useState("");
    const [salesProof, setSalesProof] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMySalesStatus();
        if (user?._id) {
            fetchMyAssignedSalesCommissions(user._id);
        }
    }, [user]);

    const fetchMySalesStatus = async () => {
        try {
            const response = await axios.get(
                "http://localhost:7687/api/salesCommission/get-my-sales-commission-status",
                { withCredentials: true }
            );
            setMySalesCommissionStatus(Array.isArray(response.data.myCommissions) ? response.data.myCommissions : []);
        } catch (error) {
            console.error("Error fetching my Sales commission:", error);
        }
    };

    const fetchMyAssignedSalesCommissions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:7687/api/salesCommission/get-my-assigned-sales-commissions",
                { withCredentials: true }
            );
            setSalesCommissionList(response.data.assignedCommissions || []);
        } catch (error) {
            console.error("Error fetching assigned commissions:", error);
        }
    };

    const handleFileChange = (e) => {
        setSalesProof(e.target.files[0]);
    };

    const handleAddSalesCommission = async (e) => {
        e.preventDefault();
        if (!selectedCommission || !salesAmount) {
            alert("Please fill out all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("salesCommissionId", selectedCommission);
        formData.append("salesAmount", salesAmount);
        if (salesProof) {
            formData.append("salesProof", salesProof);
        }

        try {
            await axios.post(
                "http://localhost:7687/api/salesCommission/add-my-sales-commission",
                formData,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success("Sales commission added successfully.");
            setSelectedCommission("");
            setSalesAmount("");
            setSalesProof(null);
            setIsModalOpen(false);
            fetchMySalesStatus();
        } catch (error) {
            toast.error("Error adding sales commission:", error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = myCommissions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(myCommissions.length / itemsPerPage);

    return (
        <div className="p-4">
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 mb-4 bg-blue-500 text-white rounded">
                Add Sales Commission
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-2">Add Sales Commission</h2>
                        <form onSubmit={handleAddSalesCommission}>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Select Commission</label>
                                <select
                                    value={selectedCommission}
                                    onChange={(e) => setSelectedCommission(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">-- Choose a Commission --</option>
                                    {assignedCommissions.map((commission) => (
                                        <option key={commission._id} value={commission._id}>
                                            {commission.salesCommissionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Sales Amount</label>
                                <input
                                    type="number"
                                    value={salesAmount}
                                    onChange={(e) => setSalesAmount(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Upload Proof (Optional)</label>
                                <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {["Commission Name", "Target Amount","Total Sales", "Commission Rate", "Status"].map((header) => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((commission) => (
                            <tr key={commission._id} className="hover:bg-gray-300 hover:text-white">
                                <td className="px-6 py-4 text-gray-700">{commission.salesCommissionId?.salesCommissionName || "N/A"}</td>
                                <td className="px-6 py-4 text-gray-700">{commission.salesCommissionId?.targetAmount || 0}</td>
                                <td className="px-6 py-4 text-gray-700">{commission.totalSales || 0}</td> 
                                <td className="px-6 py-4 text-gray-700">{commission.salesCommissionId?.commissionRate || 0}%</td>
                                <td className="px-6 py-4 font-semibold">{commission.salesStatus}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                {[...Array(totalPages).keys()].map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{page + 1}</button>
                ))}
            </div>
        </div>
    );
}

export default MySalesCommissionStatus;
