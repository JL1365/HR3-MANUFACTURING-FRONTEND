import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";

const BENEFIT_REQUEST_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/benefitRequest" 
: "https://backend-hr3.jjm-manufacturing.com/api/benefitRequest";

function AdminDashboard() {
    const [appliedRequestCount, setAppliedRequestCount] = useState(0);
    const [newRequestCount, setNewRequestCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [deniedCount, setDeniedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [totalDeductions, setTotalDeductions] = useState(0);

    useEffect(() => {
        // Fetch applied requests count
        axios.get(`${BENEFIT_REQUEST_URL}/get-all-applied-requests-count`)
            .then(response => {
                setAppliedRequestCount(response.data.totalAppliedRequests);
                setNewRequestCount(response.data.newRequestsCount);
                setApprovedCount(response.data.approvedCount);
                setDeniedCount(response.data.deniedCount);
                setPendingCount(response.data.pendingCount);
            })
            .catch(error => console.error("Error fetching applied requests:", error));

        // Fetch total deductions
        axios.get("http://localhost:7687/api/benefitDeduction/get-total-deductions")
            .then(response => setTotalDeductions(response.data.totalDeductions))
            .catch(error => console.error("Error fetching total deductions:", error));
    }, []);

    return (
        <div className="p-6">
            <Header title="Dashboard" />
            <div className="grid grid-cols-2 gap-6">
                {/* Single Card for Applied Requests */}
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md relative">
                    <h2 className="text-xl font-semibold">Applied Requests</h2>
                    <p className="text-3xl font-bold">{appliedRequestCount}</p>
                    
                    <div className="mt-3 text-sm">
                        <span className=" bg-green-600 px-2 py-1 rounded-md inline-block">
                            New: {newRequestCount}
                        </span>
                        <span className=" bg-yellow-500 px-2 py-1 rounded-md inline-block mt-2">
                            Approved: {approvedCount}
                        </span>
                        <span className=" bg-red-500 px-2 py-1 rounded-md inline-block mt-2">
                            Denied: {deniedCount}
                        </span>
                        <span className=" bg-orange-500 px-2 py-1 rounded-md inline-block mt-2">
                            Pending: {pendingCount}
                        </span>
                    </div>
                </div>

                {/* Total Benefit Deductions */}
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Total Deductions</h2>
                    <p className="text-3xl font-bold">₱{totalDeductions.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
