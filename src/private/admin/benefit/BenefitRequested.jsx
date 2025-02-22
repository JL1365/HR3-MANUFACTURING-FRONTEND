import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

function ApplyBenefit() {
  const [allRequestBenefit, setAllRequestBenefit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchallRequestBenefited();
  }, []);

  const fetchallRequestBenefited = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7687/api/benefitRequest/get-all-applied-requests",
        {
          withCredentials: true,
        }
      );
      if (response.data.allRequestBenefit) {
        setAllRequestBenefit(response.data.allRequestBenefit);
      } else {
        toast.warn("No apply requests found.");
        setAllRequestBenefit([]);
      }
    } catch (error) {
      toast.error(
        "Error fetching benefit requests: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const indexOfLastBenefit = currentPage * itemsPerPage;
  const indexOfFirstBenefit = indexOfLastBenefit - itemsPerPage;
  const currentBenefits = allRequestBenefit.slice(
    indexOfFirstBenefit,
    indexOfLastBenefit
  );
  const totalPages = Math.ceil(allRequestBenefit.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Apply Benefit" />
      <ToastContainer />
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                Name
              </th>
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBenefits.length > 0 ? (
              currentBenefits.map((benefit) => (
                <tr
                  key={benefit._id}
                  className="hover:bg-gray-300 hover:text-white"
                >
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {benefit.userId
                      ? `${benefit.userId.firstName} ${benefit.userId.lastName}`
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
                      <a
                        href={benefit.uploadDocs.frontId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2"
                      >
                        <img
                          src={benefit.uploadDocs.frontId}
                          alt="Front ID"
                          className="w-16 h-auto inline-block border rounded"
                        />
                      </a>
                    )}
                    {benefit.uploadDocs?.backId && (
                      <a
                        href={benefit.uploadDocs.backId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={benefit.uploadDocs.backId}
                          alt="Back ID"
                          className="w-16 h-auto inline-block border rounded"
                        />
                      </a>
                    )}
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

export default ApplyBenefit;
