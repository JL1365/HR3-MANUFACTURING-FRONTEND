import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RECOGNITION_PROGRAM_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/recognitionProgram" 
: "https://backend-hr3.jjm-manufacturing.com/api/recognitionProgram";

function MyRecognitionPrograms() {
  const [myRecognitions, setMyRecognitionsPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMyRecognitionPrograms();
  }, []);

  const fetchMyRecognitionPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${RECOGNITION_PROGRAM_URL}/get-my-recognition-programs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setMyRecognitionsPrograms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching my recognition programs:", error);
      toast.error("Error fetching recognition programs.");
    }
  };

  // Update Recognition Status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${RECOGNITION_PROGRAM_URL}/update-my-recognition-program-status/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Recognition Program status updated!");
      fetchMyRecognitionPrograms(); // Refresh data after update
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update recognition program status.");
    }
  };

  // Pagination logic
  const indexOfLastRecognitionPrograms = currentPage * itemsPerPage;
  const indexOfFirstRecognitionPrograms = indexOfLastRecognitionPrograms - itemsPerPage;
  const currentRecognitionPrograms = myRecognitions.slice(
    indexOfFirstRecognitionPrograms,
    indexOfLastRecognitionPrograms
  );
  const totalPages = Math.ceil(myRecognitions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Recognition Programs" />
      <ToastContainer />

      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Incentive Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Reward Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Reward Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecognitionPrograms.length > 0 ? (
              currentRecognitionPrograms.map((recognition) => (
                <tr
                  key={recognition._id}
                  className="hover:bg-gray-300 hover:text-white"
                >
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.incentiveId?.incentiveName || "No Incentive"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.rewardType || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.rewardValue || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.status || "Pending"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.status !== "Claimed" ? (
                      <button
                        onClick={() => handleUpdateStatus(recognition._id, "Claimed")}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Mark as Claimed
                      </button>
                    ) : (
                      <span className="text-green-600">Claimed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  No recognition programs found.
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

export default MyRecognitionPrograms;
