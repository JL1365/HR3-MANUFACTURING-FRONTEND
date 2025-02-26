import React, { use, useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function CompensationOverview() {
  const [compensationPlans, setCompensationPlans] = useState([]);
  const [users,setUsers] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCompensationplans();
    fetchUsers();
  }, []);

  const fetchCompensationplans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7687/api/compensation/get-compensation-plans",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      setCompensationPlans(response.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching compensation plans:",
        error.response ? error.response.data : error.message
      );
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

  // Pagination logic
  const indexOfLastCompensationPlans = currentPage * itemsPerPage;
  const indexOfFirstCompensationPlans =
    indexOfLastCompensationPlans - itemsPerPage;
  const currentCompensationPlans = Array.isArray(compensationPlans)
    ? compensationPlans.slice(
        indexOfFirstCompensationPlans,
        indexOfLastCompensationPlans
      )
    : [];

  const totalPages = Math.ceil(compensationPlans.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Compensation Overview" />


      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Hourly Rate
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                OT Rate
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Holiday Rate
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Allowances
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCompensationPlans.length > 0 ? (
              currentCompensationPlans.map((compensation) => (
                <tr
                  key={compensation._id}
                  className="hover:bg-gray-300 hover:text-white"
                >
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.position?.position}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.hourlyRate}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.overTimeRate}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.holidayRate}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.allowances &&
                    compensation.allowances.length > 0 ? (
                      <ul>
                        {compensation.allowances.map((allowance, index) => (
                          <li key={index}>
                            {allowance.type}: ₱{allowance.amount}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No allowances"
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No compensation plans available.
                </td>
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
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

    </div>
  );
}

export default CompensationOverview;

