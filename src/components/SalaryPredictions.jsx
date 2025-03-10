import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Header from "./Header";

const SalaryPredictions = () => {
    const [predictions, setPredictions] = useState([]);
    const [payrollHistories, setPayrollHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:7687/api/payroll/get-payroll-predictions")
            .then(response => {
                console.log("API Response:", response.data);
                if (response.data.success) {
                    setPredictions(response.data.predictions || []);
                    setPayrollHistories(response.data.payrollHistories || []);
                }
            })
            .catch(error => console.error("Error fetching predictions:", error))
            .finally(() => setLoading(false));
    }, []);


    const handlePredictSalaries = () => {
        setLoading(true);
        axios.get("http://localhost:7687/api/payroll/predict-salaries")
            .then(response => {
                if (response.data.success) {
                    setPredictions(response.data.predictions || []);
                }
            })
            .catch(error => console.error("Error predicting salaries:", error))
            .finally(() => setLoading(false));
    };

    const chartData = payrollHistories.map(history => {
        const prediction = predictions.find(p => new Date(p.payroll_date).toLocaleDateString() === new Date(history.payroll_date).toLocaleDateString());
        
        return {
            date: new Date(history.payroll_date).toLocaleDateString(),
            netSalary: history.netSalary,
            predictedSalary: prediction ? prediction.predictedNetSalary : null,
        };
    });

    return (
        <div className="p-6">
            <Header title="Salary Predictions" />
            
            {loading ? (
                <p className="text-center text-gray-500 mt-4">Loading data...</p>
            ) : (
                <>
                    {/* Button to trigger salary prediction */}
                    <div className="flex justify-center mb-4">
                        <button 
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600" 
                            onClick={handlePredictSalaries}
                        >
                            Predict Salaries
                        </button>
                    </div>

                    {/* Salary Table */}
                    <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Predicted Adjusted Salaries</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg">
                                <thead className="bg-gray-200">
                                    <tr className="text-left">
                                        <th className="p-2 border">Employee ID</th>
                                        <th className="p-2 border">First Name</th>
                                        <th className="p-2 border">Last Name</th>
                                        <th className="p-2 border">Predicted Gross Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {predictions.length > 0 ? (
                                        predictions.map((item) => (
                                            <tr key={item.employee_id} className="hover:bg-gray-100">
                                                <td className="p-2 border">{item.employee_id}</td>
                                                <td className="p-2 border">{item.employee_firstname}</td>
                                                <td className="p-2 border">{item.employee_lastname}</td>
                                                <td className="p-2 border font-semibold">
                                                    ₱{item.predictedNetSalary ? item.predictedNetSalary.toLocaleString() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-gray-500 p-4">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payroll History Chart */}
                    <div className="mt-8 bg-white p-4 shadow-md rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Payroll Histories & Predictions</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="netSalary" stroke="#4F46E5" name="Gross Salary" activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="predictedSalary" stroke="#FF7300" name="Predicted Salary" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500">No payroll history data available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SalaryPredictions;
