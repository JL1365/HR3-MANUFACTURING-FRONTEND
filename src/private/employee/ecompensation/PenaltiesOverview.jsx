import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import MyViolations from "./MyViolations";

const PENALTY_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/penalty" 
: "https://backend-hr3.jjm-manufacturing.com/api/penalty";

function PenaltyOverview() {
  const [allPenaltyLevels, setAllPenaltyLevels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      const response = await axios.get(
        `${PENALTY_URL}/get-all-penalties`
      );
      setAllPenaltyLevels(response.data.allPenaltyLevels || []);
    } catch (error) {
      console.error("Error fetching penalties:", error);
    }
  };

  // Pagination logic
  const indexOfLastPenalty = currentPage * itemsPerPage;
  const indexOfFirstPenalty = indexOfLastPenalty - itemsPerPage;
  const currentPenalties = allPenaltyLevels.slice(
    indexOfFirstPenalty,
    indexOfLastPenalty
  );
  const totalPages = Math.ceil(allPenaltyLevels.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Penalty Overview" />
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Violation Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Penalty Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Consequence
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPenalties.length > 0 ? (
              currentPenalties.map((penalty) => (
                <tr
                  key={penalty._id}
                  className="hover:bg-gray-300 hover:text-white"
                >
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {penalty.violationType}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {penalty.penaltyLevel}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {penalty.action}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {penalty.consequence}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No items found.
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
        <MyViolations />
    </div>
  );
}

export default PenaltyOverview;
