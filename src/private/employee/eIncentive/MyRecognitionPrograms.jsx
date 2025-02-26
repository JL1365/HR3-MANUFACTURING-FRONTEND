import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        "http://localhost:7687/api/recognitionProgram/get-my-recognition-programs",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setMyRecognitionsPrograms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching my recognition programs:", error);
      toast.error("Error fetching recognition programs.");
    }
  };

  // Pagination logic
  const indexOfLastRecognitionPrograms = currentPage * itemsPerPage;
  const indexOfFirstRecognitionPrograms =
    indexOfLastRecognitionPrograms - itemsPerPage;
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
                    {recognition.incentiveId &&
                    recognition.incentiveId.incentiveName
                      ? recognition.incentiveId.incentiveName
                      : "No Incentive"}
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
