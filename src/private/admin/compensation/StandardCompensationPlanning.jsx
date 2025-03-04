import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COMPENSATION_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/compensation" 
: "https://backend-hr3.jjm-manufacturing.com/api/compensation";


function StandardCompensationPlanning() {
  const [standardCompensations, setStandardCompensations] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    standardName: "",
    standardDescription: "",
    standardStatus: true,
  });

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

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `${COMPENSATION_URL}/update-standard-compensation/${editingItem}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Compensation updated successfully!");
      } else {
        const token = localStorage.getItem("token");
        await axios.post(
          `${COMPENSATION_URL}/create-standard-compensation`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Compensation created successfully!");
      }
      resetForm();
      fetchstandardCompensations();
      setIsOpenModal(false);
    } catch (error) {
      console.error(
        "Error saving compensation plan:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "Error saving compensation plan: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (compensation) => {
    setEditingItem(compensation._id);
    setFormData({
      standardName: compensation.standardName,
      standardDescription: compensation.standardDescription,
      standardStatus: compensation.standardStatus,
    });
    setIsEditing(true);
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      standardName: "",
      standardDescription: "",
      standardStatus: true,
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
        `${COMPENSATION_URL}/delete-standard-compensation/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setStandardCompensations(
        standardCompensations.filter((compensation) => compensation._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete item");
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
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Create Standard Compensation
      </button>

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

              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Action
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

                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleEdit(compensation)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(compensation._id)}
                    >
                      Delete
                    </button>
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

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">
              {isEditing
                ? "Edit Standard Compensation"
                : "Create Standard Compensation"}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div>
                <label>Standard Name</label>
                <input
                  type="text"
                  name="standardName"
                  value={formData.standardName}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  name="standardDescription"
                  value={formData.standardDescription}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Standard Status: </label>
                <select
                  name="standardStatus"
                  value={formData.standardStatus}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
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

export default StandardCompensationPlanning;
