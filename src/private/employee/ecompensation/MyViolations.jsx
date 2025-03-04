import React, { useEffect, useState } from "react";
import axios from "axios";

const VIOLATION_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/violation" 
: "https://backend-hr3.jjm-manufacturing.com/api/violation";

function MyViolations() {
  const [myViolations, setMyViolations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMyViolations();
  }, []);

  const fetchMyViolations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${VIOLATION_URL}/get-my-violations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setMyViolations(response.data.myViolations || []);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination logic
  const indexOfLastmyViolations = currentPage * itemsPerPage;
  const indexOfFirstmyViolations =
    indexOfLastmyViolations - itemsPerPage;
  const currentmyViolations = myViolations.slice(
    indexOfFirstmyViolations,
    indexOfLastmyViolations
  );
  const totalPages = Math.ceil(myViolations.length / itemsPerPage);

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
                Violation Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Penalty Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Violation Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Comments
              </th>
            </tr>
          </thead>
          <tbody>
            {currentmyViolations.length > 0 ? (
              currentmyViolations
                .filter((violation) => violation && violation.penaltyLevel)
                .map((violation) => (
                  <tr
                    key={violation._id}
                    className="hover:bg-gray-300 hover:text-white"
                  >
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {violation.penaltyLevel?.violationType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {violation.penaltyLevel?.penaltyLevel || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {formatDate(violation.violationDate)}
                    </td>
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      {violation.comments || "No comments"}
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

    </div>
  );
}

export default MyViolations;
