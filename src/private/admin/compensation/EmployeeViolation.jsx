import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmployeeViolation() {
  const [employeeViolations, setEmployeeViolations] = useState([]);
  const [allPenaltyLevels, setAllPenaltyLevels] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    violationType: "",
    penaltyLevel: "",
    violationDate: "",
    comments: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchViolations();
    fetchUsers();
    fetchPenalties();
  }, []);

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7687/api/violation/get-all-violations",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setEmployeeViolations(response.data.employeeViolations || []);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7687/api/auth/get-all-users",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPenalties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:7687/api/penalty/get-all-penalties",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAllPenaltyLevels(response.data.allPenaltyLevels || []);
    } catch (error) {
      console.error("Error fetching penalties:", error);
    }
  };
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `http://localhost:7687/api/violation/update-violation-status/${editingItem}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Violation updated successfully!");
      } else {
        await axios.post(
          "http://localhost:7687/api/violation/create-penalty-violation",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Penalty violation created successfully!");
      }
      resetForm();
      fetchViolations();
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
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleEdit = (employeeViolation) => {
    setEditingItem(employeeViolation._id);
    setFormData({
      userId: employeeViolation.userId ? employeeViolation.userId._id : "",
      violationType: employeeViolation.violationType,
      penaltyLevel: employeeViolation.penaltyLevel
        ? employeeViolation.penaltyLevel._id
        : "",
      violationDate: employeeViolation.violationDate
        ? new Date(employeeViolation.violationDate).toISOString().slice(0, 16)
        : "",
      comments: employeeViolation.comments,
    });
    setIsEditing(true);
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      violationType: "",
      penaltyLevel: "",
      violationDate: "",
      comments: "",
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    toast.success("Item deleted successfully!");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:7687/api/violation/delete-violation/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setEmployeeViolations(
        employeeViolations.filter((alViolations) => alViolations._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete item");
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
  const indexOfLastEmployeeViolations = currentPage * itemsPerPage;
  const indexOfFirstEmployeeViolations =
    indexOfLastEmployeeViolations - itemsPerPage;
  const currentEmployeeViolations = employeeViolations.slice(
    indexOfFirstEmployeeViolations,
    indexOfLastEmployeeViolations
  );
  const totalPages = Math.ceil(employeeViolations.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const filteredViolations = employeeViolations?.filter((v) => v !== null);

  return (
    <div>
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Create Employee Violations
      </button>

      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Name
              </th>
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployeeViolations.length > 0 ? (
              currentEmployeeViolations
                .filter((violation) => violation && violation.penaltyLevel)
                .map((violation) => (
                  <tr
                    key={violation._id}
                    className="hover:bg-gray-300 hover:text-white"
                  >
                    <td>
                      {violation.userId?.firstName || "Unknown"}{" "}
                      {violation.userId?.lastName || ""}
                    </td>

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
                    <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleEdit(violation)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => handleDelete(violation._id)}
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
              {isEditing ? "Edit Violation" : "Create Violation"}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div>
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
              </div>
              <div>
                <label>Penalty Level</label>
                <select
                  name="penaltyLevel"
                  value={formData.penaltyLevel}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                >
                  <option value="">Select Penalty Level</option>
                  {allPenaltyLevels.length > 0 ? (
                    allPenaltyLevels.map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.violationType} - Level {level.penaltyLevel}
                      </option>
                    ))
                  ) : (
                    <option disabled>No penalty levels available</option>
                  )}
                </select>
              </div>
              <div>
                <label>Violation Date</label>
                <input
                  type="datetime-local"
                  name="violationDate"
                  value={formData.violationDate}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Comments</label>
                <input
                  type="text"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
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
    </div>
  );
}

export default EmployeeViolation;
