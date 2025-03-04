import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/Header";

const BENEFIT_URL = process.env.NODE_ENV === "development" 
  ? "http://localhost:7687/api/benefit" 
  : "https://backend-hr3.jjm-manufacturing.com/api/benefit";

const SendDocuments = () => {
  const [formData, setFormData] = useState({
    description: "",
    remarks: "",
    documentFile: null,
  });

  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BENEFIT_URL}/get-uploaded-documents`);
      setDocuments(response.data.documents || []);
    } catch (error) {
      setError("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documentFile: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({ description: "", remarks: "", documentFile: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.documentFile) {
      toast.error("All fields are required.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("description", formData.description);
    formDataObj.append("remarks", formData.remarks);
    formDataObj.append("documentFile", formData.documentFile);

    try {
      await axios.post("http://localhost:7687/api/benefit/send-benefit-documents", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document sent successfully!");
      resetForm();
      fetchDocuments();
      setIsOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDocumentClick = (documentUrl) => {
    setPdfPreview(documentUrl);
  };
  
  const handleDownloadClick = (e, documentUrl) => {
    e.preventDefault();
    const link = window.document.createElement("a");
    link.href = documentUrl;
    link.setAttribute("download", "document.pdf");
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = documents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header title="Send Documents"/>
      <ToastContainer />
      <button
        className="mb-4 px-4 py-2 btn btn-primary text-white rounded"
        onClick={() => setIsOpenModal(true)}
      >
        Send Document
      </button>

      <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Documents</h2>

        {loading && <p className="text-blue-500">Loading documents...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Remarks</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">Document</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((document) => (
                <tr key={document._id} className="hover:bg-gray-300 hover:text-white">
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{document.description}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">{document.remarks}</td>
                  <td className="px-6 py-4 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                    {document.documentFile ? (
                      <>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDocumentClick(document.documentFile);
                          }}
                          className="text-blue-500 underline"
                        >
                          View PDF
                        </a>
                        <a
  href="#"
  onClick={(e) => handleDownloadClick(e, document.documentFile)}
  className="text-blue-500 underline ml-2"
>
  Download PDF
</a>

                      </>
                    ) : (
                      "No Document"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">No documents found.</td>
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
            <h2 className="text-xl mb-4">Send Document</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label>Document</label>
                <input
                  type="file"
                  name="documentFile"
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

export default SendDocuments;
