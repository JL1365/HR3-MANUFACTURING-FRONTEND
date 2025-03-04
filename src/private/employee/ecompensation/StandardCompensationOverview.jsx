import React, { useEffect, useState } from "react";
import axios from "axios";

const COMPENSATION_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/compensation" 
: "https://backend-hr3.jjm-manufacturing.com/api/compensation";

function StandardCompensationOverview() {
  const [standardCompensations, setStandardCompensations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchstandardCompensations();
  }, []);

  const fetchstandardCompensations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${COMPENSATION_URL}/get-standard-compensations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      setStandardCompensations(response.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching compensation plans:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Pagination logic
  const indexOfLastStandardCompensations = currentPage * itemsPerPage;
  const indexOfFirstStandardCompensations =
    indexOfLastStandardCompensations - itemsPerPage;
  const currentStandardCompensations = Array.isArray(standardCompensations)
    ? standardCompensations.slice(
        indexOfFirstStandardCompensations,
        indexOfLastStandardCompensations
      )
    : [];

  const totalPages = Math.ceil(standardCompensations.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Standard Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Status
              </th>

            </tr>
          </thead>
          <tbody>
            {currentStandardCompensations.length > 0 ? (
              currentStandardCompensations.map((compensation) => (
                <tr
                  key={compensation._id}
                  className="hover:bg-gray-300 hover:text-white"
                >
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.standardName}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.standardDescription}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.standardStatus
                      ? "Available"
                      : "Not Available"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No standard compensation available.
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

export default StandardCompensationOverview;
