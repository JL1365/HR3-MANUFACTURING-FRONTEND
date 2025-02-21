import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";

function BenefitsManagement() {
    const [allBenefits, setBenefits] = useState([]);

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

    return (
        <div>
            <Header title="Benefits Management" />
            
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
                        {allBenefits.length > 0 ? (
                            allBenefits.map((benefit) => (       
                                <tr key={benefit._id} className="hover:bg-gray-300 hover:text-white">
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitName}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitDescription}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.benefitType}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{benefit.isNeedRequest ? "Yes" : "No"}</td>
                                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
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
        </div>
    );
}

export default BenefitsManagement;
