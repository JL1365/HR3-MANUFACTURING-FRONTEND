import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";
import EmployeeViolation from "./EmployeeViolation";

function PenaltyLevel() {
  const [allPenaltyLevels, setAllPenaltyLevels] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    violationType: "",
    penaltyLevel: 0,
    action: "",
    consequence: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/penalty/get-all-penalties"
      );
      setAllPenaltyLevels(response.data.allPenaltyLevels || []);
    } catch (error) {
      console.error("Error fetching penalties:", error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:7687/api/penalty/update-penalty/${editingItem}`,
          formData
        );
        toast.success("Penalty updated successfully!");
      } else {
        await axios.post(
          "http://localhost:7687/api/penalty/create-penalty-level",
          formData
        );
        toast.success("Penalty created successfully!");
      }
      resetForm();
      fetchPenalties();
      setIsOpenModal(false);
    } catch (error) {
      console.error(
        "Error saving penalty:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "Error saving penalty: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "penaltyLevel" ? Number(value) : value,
    });
  };

  const handleEdit = (penalty) => {
    setEditingItem(penalty._id);
    setFormData({
      violationType: penalty.violationType,
      penaltyLevel: penalty.penaltyLevel,
      action: penalty.action,
      consequence: penalty.consequence,
    });
    setIsEditing(true);
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      violationType: "",
      penaltyLevel: 0,
      action: "",
      consequence: "",
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    toast.success("Item deleted successfully!");
    try {
      await axios.delete(
        `http://localhost:7687/api/penalty/delete-penalty/${id}`
      );
      setAllPenaltyLevels(
        allPenaltyLevels.filter((allPenalty) => allPenalty._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete item");
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
      <Header title="Penalty Level" />
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Create Penalty Level
      </button>

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
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Action
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
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(penalty)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(penalty._id)}
                    >
                      Delete
                    </button>
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

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">
              {isEditing ? "Edit Penalty" : "Create Penalty"}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div>
                <label>Violation Type</label>
                <input
                  type="text"
                  name="violationType"
                  value={formData.violationType}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Penalty Level</label>
                <input
                  type="number"
                  name="penaltyLevel"
                  value={formData.penaltyLevel}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Response</label>
                <input
                  type="text"
                  name="action"
                  value={formData.action}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Consequence</label>
                <input
                  type="text"
                  name="consequence"
                  value={formData.consequence}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              >
                {isEditing ? "Update" : "Create"}
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
      <EmployeeViolation />
    </div>
  );
}

export default PenaltyLevel;
