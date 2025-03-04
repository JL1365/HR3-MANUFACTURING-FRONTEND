import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RECOGNITION_PROGRAM_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/recognitionProgram" 
  : "https://backend-hr3.jjm-manufacturing.com/api/recognitionProgram";

  const AUTH_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/auth" 
  : "https://backend-hr3.jjm-manufacturing.com/api/auth";

  const INCENTIVE_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/incentive" 
  : "https://backend-hr3.jjm-manufacturing.com/api/incentive";


function RecognitionPrograms() {
  const [allRecognitionPrograms, setRecognitionPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    incentiveId: "",
    description: "",
    rewardType: "",
    rewardValue: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRecognitionPrograms();
    fetchIncentives();
  }, []);

  const fetchRecognitionPrograms = async () => {
    try {
      const response = await axios.get(
        `${RECOGNITION_PROGRAM_URL}/get-all-recognition-programs`
      );
      console.log("API Response:", response.data); // I-check kung nandito ang firstName at lastName
      setRecognitionPrograms(response.data || []);
    } catch (error) {
      console.error("Error fetching recognition programs:", error);
    }
  };
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${AUTH_URL}/get-all-users`
      );
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchIncentives = async () => {
    try {
      const response = await axios.get(
        `${INCENTIVE_URL}/get-all-incentives`
      );
      setIncentives(response.data.allIncentives || []);
    } catch (error) {
      console.error("Error fetching incentives:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${RECOGNITION_PROGRAM_URL}/delete-recognition-program/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setRecognitionPrograms(
        allRecognitionPrograms.filter(
          (allRecognition) => allRecognition._id !== id
        )
      );
      toast.success("Recognition program deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete recognition program!");
    }
  };

  const handleEdit = (recognition) => {
    setFormData({
      _id: recognition._id,
      userId: recognition.userId,
      incentiveId: recognition.incentiveId,
      description: recognition.description,
      rewardType: recognition.rewardType,
      rewardValue: recognition.rewardValue || "",
    });
    Promise.all([fetchUsers(), fetchIncentives()]).then(() => {
      setIsOpenModal(true);
    });
  };

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { rewardType, rewardValue } = formData;

    // Validation: Ensure Reward Value is valid for "Bonus" or "Cash"
    if (["Bonus", "Cash"].includes(rewardType)) {
      if (!rewardValue || isNaN(rewardValue) || rewardValue <= 0) {
        setError("Reward value is required and must be a positive number for Bonus or Cash.");
        return;
      }
    }
    try {
      const token = localStorage.getItem("token");

      if (formData._id) {

        await axios.put(
          `${RECOGNITION_PROGRAM_URL}/update-recognition-program/${formData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Recognition program updated successfully!");
      } else {
     
        await axios.post(
          `${RECOGNITION_PROGRAM_URL}/create-recognition-program`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Recognition program created successfully!");
      }

      fetchRecognitionPrograms();
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error saving recognition program:", error);
      toast.error("Failed to save recognition program!");
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
  const indexOfLastRecognitionPrograms = currentPage * itemsPerPage;
  const indexOfFirstRecognitionPrograms =
    indexOfLastRecognitionPrograms - itemsPerPage;
  const currentRecognitionPrograms = allRecognitionPrograms.slice(
    indexOfFirstRecognitionPrograms,
    indexOfLastRecognitionPrograms
  );
  const totalPages = Math.ceil(allRecognitionPrograms.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Recognition Programs" />
      <ToastContainer />

      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          fetchUsers();
          fetchIncentives();
          setFormData({
            userId: "",
            incentiveId: "",
            description: "",
            rewardType: "",
            rewardValue: "",
          });
          setIsOpenModal(true);
        }}
      >
        Create Recognition Program
      </button>

      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Name
              </th>
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
                Action
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
                    {recognition.user?.firstName}{" "}
                    {recognition.user?.lastName}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {recognition.incentiveId
                      ? incentives.find(
                          (incentive) =>
                            incentive._id === recognition.incentiveId
                        )?.incentiveName || "No Incentive"
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

                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(recognition)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(recognition._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
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

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {formData._id
                ? "Edit Recognition Program"
                : "Create Recognition Program"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Select User:</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Select Incentive:</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={formData.incentiveId}
                onChange={(e) =>
                  setFormData({ ...formData, incentiveId: e.target.value })
                }
                required
              >
                <option value="">-- Select Incentive --</option>
                {incentives.map((incentive) => (
                  <option key={incentive._id} value={incentive._id}>
                    {incentive.incentiveName}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Description:</label>
              <textarea
                className="w-full p-2 border rounded mb-4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

      <label className="block mb-2">Reward Type:</label>
      <select
        className="w-full p-2 border rounded mb-4"
        name="rewardType"
        value={formData.rewardType}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Reward Type --</option>
        <option value="Bonus">Bonus</option>
        <option value="Cash">Cash</option>
        <option value="Gift">Gift</option>
        <option value="Promotion">Promotion</option>
      </select>

      {(formData.rewardType === "Bonus" || formData.rewardType === "Cash") && (
        <>
          <label className="block mb-2">Reward Value:</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            name="rewardValue"
            value={formData.rewardValue}
            onChange={handleChange}
            min="1"
            required
          />
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}              
      <button
                type="submit"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                {formData._id
                  ? "Update Recognition Program"
                  : "Create Recognition Program"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecognitionPrograms;
