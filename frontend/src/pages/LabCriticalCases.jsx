import { useEffect, useState } from 'react';
import axios from 'axios';

const LabCriticalCases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/lab/critical-cases', config);
    setCases(res.data);
  };

  const downloadReport = (fileUrl) => {
    window.open(`http://localhost:5000/${fileUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Critical Cases</h1>
          <p className="text-gray-600">Monitor and manage urgent laboratory test results requiring immediate attention</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-triangle text-white"></i>
              </div>
              Urgent Test Results
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-user mr-2"></i>Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-flask mr-2"></i>Test Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-comment-medical mr-2"></i>Remarks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-cogs mr-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cases.map(case_ => (
                    <tr key={case_._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{case_.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{case_.testName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="flex items-start">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                            <i className="fas fa-exclamation-triangle mr-1"></i>Critical
                          </span>
                          <span className="flex-1">{case_.remarks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {case_.fileUrl && (
                          <button
                            onClick={() => downloadReport(case_.fileUrl)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-download mr-1"></i>Download Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabCriticalCases;