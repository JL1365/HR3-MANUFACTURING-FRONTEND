import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

const BUDGET_REQUEST_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/integration" 
: "https://backend-hr3.jjm-manufacturing.com/api/integration";


const BudgetRequestForm = () => {
  const [formData, setFormData] = useState({
 
    totalBudget: "",
    category: "",
    reason: "",
    documents: null,
  });

  const [budgetRequests, setBudgetRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBudgetRequests();
  }, []);

  const fetchBudgetRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BUDGET_REQUEST_URL}/get-request-budget`);
      setBudgetRequests(response.data);
    } catch (error) {
      setError("Failed to fetch budget requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({ totalBudget: "", category: "", reason: "", documents: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.totalBudget || !formData.category || !formData.reason || !formData.documents) {
      toast.error("All fields are required.");
      return;
    }

    if (formData.category !== "Operational Expenses") {
      toast.error("HR3 must use category: 'Operational Expenses'.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("department", "HR3");
    formDataObj.append("totalBudget", formData.totalBudget);
    formDataObj.append("category", formData.category);
    formDataObj.append("reason", formData.reason);
    formDataObj.append("documents", formData.documents);
console.log("Selected file:", formData.documents);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BUDGET_REQUEST_URL}/request-budget`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
         },
         withCredentials: true,
      }
    );
      toast.success("Budget request submitted successfully!");
      resetForm();
      fetchBudgetRequests();
      setIsOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDocumentClick = (documentUrl) => {
    setPdfPreview(documentUrl);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = budgetRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(budgetRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Request budget"/>
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => setIsOpenModal(true)}
      >
        Create Budget Request
      </button>

      <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Budget Requests</h2>

        {loading && <p className="text-blue-500">Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Total Budget</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Document</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((request) => (
                <tr key={request._id} className="hover:bg-gray-300 hover:text-white">
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">₱{request.totalBudget}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{request.category}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{request.reason}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {request.documents ? (
                      <>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDocumentClick(request.documents);
                          }}
                          className="text-blue-500 underline"
                        >
                          View PDF
                        </a>
                        <a
                          href={request.documents}
                          download
                          onClick={(e) => {
                            e.preventDefault();
                            const link = document.createElement("a");
                            link.href = request.documents;
                            link.setAttribute("download", "document.pdf");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-blue-500 underline ml-2"
                        >
                          Download PDF
                        </a>
                      </>
                    ) : (
                      "No Document"
                    )}
                  </td>

                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{request.status || "Pending"}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{request.comment || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No budget requests found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {pdfPreview && (
        <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">PDF Preview</h2>
          <iframe
            src={pdfPreview}
            width="100%"
            height="500px"
            className="border rounded"
          ></iframe>
        </div>
      )}

      {isOpenModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Create Budget Request</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                >
                  <option value="">Select Category</option>
                  <option value="Operational Expenses">Operational Expenses</option>
                </select>
              </div>
              <div>
                <label>Total Budget</label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                ></textarea>
              </div>
              <div>
                <label>Documents</label>
                <input
                  type="file"
                  name="documents"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Submit</button>
              <button type="button" onClick={() => setIsOpenModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetRequestForm;
