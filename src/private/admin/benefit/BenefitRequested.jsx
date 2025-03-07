import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

const BENEFIT_REQUESTED_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/benefitRequest" 
  : "https://backend-hr3.jjm-manufacturing.com/api/benefitRequest";


function ApplyBenefit() {
  const [updatedRequestBenefit, setUpdatedRequestBenefit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchupdatedRequestBenefited();
  }, []);

  const fetchupdatedRequestBenefited = async () => {
    try {
      const response = await axios.get(
        `${BENEFIT_REQUESTED_URL}/get-all-applied-requests`,
        {
          withCredentials: true,
        }
      );
      if (response.data.updatedRequestBenefit) {
        const sortedBenefits = response.data.updatedRequestBenefit.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUpdatedRequestBenefit(sortedBenefits);
      } else {
        toast.warn("No apply requests found.");
        setUpdatedRequestBenefit([]);
      }
    } catch (error) {
      console.log(
        "Error fetching benefit requests: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const indexOfLastBenefit = currentPage * itemsPerPage;
  const indexOfFirstBenefit = indexOfLastBenefit - itemsPerPage;
  const currentBenefits = updatedRequestBenefit.slice(
    indexOfFirstBenefit,
    indexOfLastBenefit
  );
  const totalPages = Math.ceil(updatedRequestBenefit.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    const currentRequest = updatedRequestBenefit.find(benefit => benefit._id === requestId);

    if (currentRequest.status === "Approved" || currentRequest.status === "Denied") {
      toast.warn(`Cannot change status. Current status is already ${currentRequest.status}.`);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:7687/api/benefitRequest/update-apply-request-status/${requestId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchupdatedRequestBenefited();
    } catch (error) {
      toast.error(
        "Error updating benefit request status: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <div>
      <Header title="Applied Request" />
      <ToastContainer />
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Benefit Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Upload Docs</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Requested</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Date Finalized</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBenefits.length > 0 ? (
              currentBenefits.map((benefit) => (
                <tr key={benefit._id} className="hover:bg-gray-300 hover:text-white">
<td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
  {benefit?.user?.firstName && benefit?.user?.lastName
    ? `${benefit.user.firstName} ${benefit.user.lastName}`
    : "N/A"}
</td>

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
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.status === "Approved" || benefit.status === "Denied" ? (
                      formatDate(benefit.updatedAt)
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.status === "Approved" || benefit.status === "Denied" ? (
                      <span className="text-gray-500">Finalized</span>
                    ) : (
                      <>
                        <button onClick={() => updateRequestStatus(benefit._id, "Approved")} className="mr-2 text-green-500">Approve</button>
                        <button onClick={() => updateRequestStatus(benefit._id, "Denied")} className="text-red-500">Deny</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">No items found.</td>
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
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ApplyBenefit;
