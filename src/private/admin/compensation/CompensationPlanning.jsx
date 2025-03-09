import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StandardCompensationPlanning from "./StandardCompensationPlanning";

const COMPENSATION_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7687/api/compensation"
    : "https://backend-hr3.jjm-manufacturing.com/api/compensation";

const AUTH_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7687/api/auth"
    : "https://backend-hr3.jjm-manufacturing.com/api/auth";

function CompensationPlanning() {
  const [compensationPlans, setCompensationPlans] = useState([]);
  const [positions, setPositions] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    position: "",
    hourlyRate: "",
    overTimeRate: "",
    holidayRate: "",
    allowances: [],
    benefits: [],
    paidLeaves: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCompensationplans();
    fetchPositions();
  }, []);

  const fetchCompensationplans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${COMPENSATION_URL}/get-compensation-plans`,
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
  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${AUTH_URL}/get-all-positions`);
      setPositions(response.data.positions || []);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `${COMPENSATION_URL}/update-compensation-plan/${editingItem}`,
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
          `${COMPENSATION_URL}/create-compensation-plan`,
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
      fetchCompensationplans();
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (compensation) => {
    setEditingItem(compensation._id);
    setFormData({
      position: compensation.position.position,
      hourlyRate: compensation.hourlyRate,
      overTimeRate: compensation.overTimeRate,
      holidayRate: compensation.holidayRate,
      allowances: compensation.allowances,
      benefits: compensation.benefits,
      paidLeaves: compensation.paidLeaves,
    });
    setIsEditing(true);
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      position: "",
      hourlyRate: "",
      overTimeRate: "",
      holidayRate: "",
      allowances: [],
      benefits: [],
      paidLeaves: [],
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    toast.success("Item deleted successfully!");
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${COMPENSATION_URL}/delete-compensation-plan/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCompensationPlans(
        compensationPlans.filter((compensation) => compensation._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete item");
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
      <Header title="Compensation Planning" />
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Create Compensation Planning
      </button>

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
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Benefits
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Paid Leaves
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Action
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
                    {compensation.positionName}
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
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.benefits &&
                    compensation.benefits.length > 0 ? (
                      <ul>
                        {compensation.benefits.map((benefit, index) => (
                          <li key={index}>
                            {benefit.benefitType}: ₱{benefit.deductionsAmount}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No benefits"
                    )}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {compensation.paidLeaves &&
                    compensation.paidLeaves.length > 0 ? (
                      <ul>
                        {compensation.paidLeaves.map((paidLeave, index) => (
                          <li key={index}>
                            {paidLeave.leavesType}: ₱{paidLeave.paidLeavesAmount}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Paid Leaves"
                    )}
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
                ? "Edit Compensation Plan"
                : "Create Compensation Plan"}
            </h2>
            <form onSubmit={handleCreateOrUpdate}>
              <div>
                <label>Position</label>
                <select
                  className="form-select"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  disabled={isEditing}
                >
                  <option value="">Select Position</option>
                  {(positions ?? []).map((pos, index) => (
                    <option key={index} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Hourly Rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Overtime Rate</label>
                <input
                  type="number"
                  name="overTimeRate"
                  value={formData.overTimeRate}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Holiday Rate</label>
                <input
                  type="number"
                  name="holidayRate"
                  value={formData.holidayRate}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
                {formData.allowances.length > 0 ? (
                  formData.allowances.map((allowance, index) => (
                    <div key={index} className="flex justify-between mb-4">
                      <div>
                        <label>Allowance Type</label>
                        <input
                          type="text"
                          name={`allowanceType${index}`}
                          value={allowance.type}
                          onChange={(e) => {
                            const newAllowances = [...formData.allowances];
                            newAllowances[index].type = e.target.value;
                            setFormData({
                              ...formData,
                              allowances: newAllowances,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>

                      <div>
                        <label>Amount</label>
                        <input
                          type="number"
                          name={`allowanceAmount${index}`}
                          value={allowance.amount}
                          onChange={(e) => {
                            const newAllowances = [...formData.allowances];
                            newAllowances[index].amount = e.target.value;
                            setFormData({
                              ...formData,
                              allowances: newAllowances,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>
                      <div className="flex justify-center items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              allowances: formData.allowances.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No allowances available</div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      allowances: [
                        ...formData.allowances,
                        { type: "", amount: "" },
                      ],
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Allowance
                </button>

                {/* BENEFITS */}
                {formData.benefits.length > 0 ? (
                  formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex justify-between mb-4">
                      <div>
                        <label>Benefit Type</label>
                        <input
                          type="text"
                          name={`benefitType${index}`}
                          value={benefit.benefitType}
                          onChange={(e) => {
                            const newBenefits = [...formData.benefits];
                            newBenefits[index].benefitType = e.target.value;
                            setFormData({
                              ...formData,
                              benefits: newBenefits,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>
                      <div>
                        <label>Amount</label>
                        <input
                          type="number"
                          name={`deductionsAmount${index}`}
                          value={benefit.deductionsAmount}
                          onChange={(e) => {
                            const newBenefits = [...formData.benefits];
                            newBenefits[index].deductionsAmount =
                              e.target.value;
                            setFormData({
                              ...formData,
                              benefits: newBenefits,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>
                      <div className="flex justify-center items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              benefits: formData.benefits.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No benefits available</div>
                )}

<button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      benefits: [
                        ...formData.benefits,
                        { benefitType: "", deductionsAmount: "" },
                      ],
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Benefits
                </button>


                {/* PAID LEAVES */}
                {formData.paidLeaves.length > 0 ? (
                  formData.paidLeaves.map((paidLeave, index) => (
                    <div key={index} className="flex justify-between mb-4">
                      <div>
                        <label>paidLeave Type</label>
                        <input
                          type="text"
                          name={`leavesType${index}`}
                          value={paidLeave.paidLeaveType}
                          onChange={(e) => {
                            const newPaidLeaves = [...formData.paidLeaves];
                            newPaidLeaves[index].leavesType = e.target.value;
                            setFormData({
                              ...formData,
                              paidLeaves: newPaidLeaves,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>
                      <div>
                        <label>Amount</label>
                        <input
                          type="number"
                          name={`paidLeavesAmount${index}`}
                          value={paidLeave.paidLeavesAmount}
                          onChange={(e) => {
                            const newPaidLeaves = [...formData.paidLeaves];
                            newPaidLeaves[index].paidLeavesAmount =
                              e.target.value;
                            setFormData({
                              ...formData,
                              paidLeaves: newPaidLeaves,
                            });
                          }}
                          required
                          className="border p-2 w-full"
                        />
                      </div>
                      <div className="flex justify-center items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paidLeaves: formData.paidLeaves.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No Paid Leaves available</div>
                )}
                

<button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paidLeaves: [
                        ...formData.paidLeaves,
                        { leavesType: "", paidLeavesAmount: "" },
                      ],
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Paid Leaves
                </button>

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
      <StandardCompensationPlanning />
    </div>
  );
}

export default CompensationPlanning;
