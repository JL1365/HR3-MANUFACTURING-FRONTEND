import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

const BENEFIT_REQUEST_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/benefitRequest" 
: "https://backend-hr3.jjm-manufacturing.com/api/benefitRequest";

const BENEFIT_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/benefit" 
: "https://backend-hr3.jjm-manufacturing.com/api/benefit";

function ApplyBenefit() {
  const [myApplyRequests, setMyApplyRequests] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    benefitId: "",
    frontId: null,
    backId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allBenefits, setAllBenefits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMyApplyRequested();
    fetchBenefits();
  }, []);

  const fetchMyApplyRequested = async () => {
    try {
      const response = await axios.get(
        `${BENEFIT_REQUEST_URL}/get-my-apply-requests`,
        {
          withCredentials: true,
        }
      );
      if (response.data.myApplyRequests) {
        const sortedMyApplyRequest = response.data.myApplyRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMyApplyRequests(sortedMyApplyRequest);
      } else {
        toast.warn("No apply requests found.");
        setMyApplyRequests([]);
      }
    } catch (error) {
      toast.error(
        "Error fetching benefit requests: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  const fetchBenefits = async () => {
    try {
      const response = await axios.get(
        `${BENEFIT_URL}/get-all-benefits`,
        {
          withCredentials: true,
        }
      );
      console.log("Benefits response:", response.data);
      const filteredBenefits = response.data.allBenefits.filter(
        (benefit) => benefit.isNeedRequest !== false
      );
  
      setAllBenefits(filteredBenefits);
    } catch (error) {
      console.error("Error fetching benefits:", error);
      toast.error(
        "Error fetching benefits: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSubmit = new FormData();
  
    formDataToSubmit.append("benefitId", formData.benefitId);
  
    if (formData.frontId) {
      formDataToSubmit.append("frontId", formData.frontId);
    }
    if (formData.backId) {
      formDataToSubmit.append("backId", formData.backId);
    }
  
    try {
      if (isEditing && editingItem) {
        await axios.put(
          `http://localhost:7687/api/benefitRequest/update-uploaded-docs/${editingItem._id}`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Documents updated successfully!");
      } else {
        await axios.post(
          "http://localhost:7687/api/benefitRequest/apply-benefit",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Benefit applied successfully!");
      }
      resetForm();
      fetchMyApplyRequested();
      setIsOpenModal(false);
    } catch (error) {
      toast.error(
        "Error saving documents: " +
          (error.response ? error.response.data.message : error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEdit = (benefit) => {
    setIsEditing(true);
    setEditingItem(benefit);
    setFormData({
      benefitId: benefit.benefitId ? benefit.benefitId._id : "",
      frontId: null,
      backId: null,
    });
    setIsOpenModal(true);
  };

  const resetForm = () => {
    setFormData({
      benefitId: "",
      frontId: null,
      backId: null,
    });
    setEditingItem(null);
    setIsEditing(false);
  };

  const indexOfLastBenefit = currentPage * itemsPerPage;
  const indexOfFirstBenefit = indexOfLastBenefit - itemsPerPage;
  const currentBenefits = myApplyRequests.slice(
    indexOfFirstBenefit,
    indexOfLastBenefit
  );
  const totalPages = Math.ceil(myApplyRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Apply Benefit" />
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => {
          resetForm();
          setIsOpenModal(true);
        }}
      >
        Apply Benefit
      </button>

      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Benefit Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Upload Docs
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBenefits.length > 0 ? (
              currentBenefits.map((benefit) => (
                <tr key={benefit._id} className="hover:bg-gray-300 hover:text-white">
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.benefitId ? benefit.benefitId.benefitName : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.status}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.uploadDocs?.frontId && (
                      <a href={benefit.uploadDocs.frontId} target="_blank" rel="noopener noreferrer" className="mr-2">
                        <img src={benefit.uploadDocs.frontId} alt="Front ID" className="w-16 h-auto inline-block border rounded" />
                      </a>
                    )}
                    {benefit.uploadDocs?.backId && (
                      <a href={benefit.uploadDocs.backId} target="_blank" rel="noopener noreferrer">
                        <img src={benefit.uploadDocs.backId} alt="Back ID" className="w-16 h-auto inline-block border rounded" />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
  {formatDate(benefit.createdAt)}
</td>

                  <td>
                    <button className="btn btn-primary mr-2" onClick={() => handleEdit(benefit)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isOpenModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-xl mb-4">{isEditing ? "Edit Benefit" : "Create Benefit"}</h2>
      <form onSubmit={handleCreateOrUpdate}>
        {!isEditing && (
          <div>
            <label className="block mb-2">Select Benefit Name</label>
            <select
              name="benefitId"
              value={formData.benefitId}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Select a benefit</option>
              {allBenefits.map((benefit) => (
                <option key={benefit._id} value={benefit._id}>
                  {benefit.benefitName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>Upload Front ID</label>
          <input
            type="file"
            name="frontId"
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {isEditing && editingItem.uploadDocs?.frontId && (
            <p>Current Front ID: <a href={editingItem.uploadDocs.frontId} target="_blank" rel="noopener noreferrer">View</a></p>
          )}
        </div>
        <div>
          <label>Upload Back ID</label>
          <input
            type="file"
            name="backId"
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {isEditing && editingItem.uploadDocs?.backId && (
            <p>Current Back ID: <a href={editingItem.uploadDocs.backId} target="_blank" rel="noopener noreferrer">View</a></p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setIsOpenModal(false)}
            className="border p-2 rounded bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="border p-2 rounded bg-blue-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isEditing ? "Update Documents" : "Apply Benefit"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default ApplyBenefit;
