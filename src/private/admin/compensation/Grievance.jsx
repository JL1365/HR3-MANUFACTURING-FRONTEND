import { useEffect, useState } from "react";
import axios from "axios";

function Grievance() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Change this to modify records per page

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await axios.get("http://localhost:7687/api/integration/get-all-grievance");
        setGrievances(response.data);
      } catch (err) {
        console.error("Error fetching grievances:", err);
        setError("Failed to load grievances.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = grievances.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(grievances.length / recordsPerPage);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Grievances</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700">
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">File</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((grievance) => (
              <tr key={grievance._id} className="border">
                <td className="px-4 py-2 border">{grievance.ComplaintDescription}</td>
                <td className="px-4 py-2 border">{new Date(grievance.date).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  {grievance.File ? (
                    <div className="flex flex-col items-center">
                      {/* Check if file is an image */}
                      {grievance.File.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <img 
                          src={grievance.File} 
                          alt="Uploaded File" 
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      ) : (
                        <a
                          href={grievance.File}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  ) : (
                    "No File"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Grievance;
