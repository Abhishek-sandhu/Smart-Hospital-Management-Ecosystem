import { useEffect, useState } from 'react';
import axios from 'axios';

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ remarks: '', critical: false });
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/lab/reports', config);
    setReports(res.data);
  };

  const handleEdit = (report) => {
    setEditing(report._id);
    setEditForm({ remarks: report.remarks || '', critical: report.critical });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditFile = (e) => setEditFile(e.target.files[0]);

  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('remarks', editForm.remarks);
    formData.append('critical', editForm.critical);
    if (editFile) formData.append('file', editFile);

    try {
      await axios.put(`http://localhost:5000/api/lab/report/${editing}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setEditing(null);
      fetchReports();
      alert('Report updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  const downloadReport = (fileUrl) => {
    window.open(`http://localhost:5000/${fileUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports History</h1>
          <p className="text-gray-600">View and manage laboratory test reports and results</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-file-medical text-white"></i>
              </div>
              Laboratory Reports
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
                      <i className="fas fa-info-circle mr-2"></i>Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-exclamation-triangle mr-2"></i>Critical
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-cogs mr-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map(report => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.testName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            report.status === 'completed' ? 'fa-check-circle' : 'fa-clock'
                          }`}></i>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.critical ? (
                          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                            <i className="fas fa-exclamation-triangle mr-1"></i>Critical
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            <i className="fas fa-check mr-1"></i>Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {editing === report._id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                              <input
                                name="remarks"
                                value={editForm.remarks}
                                onChange={handleEditChange}
                                placeholder="Enter remarks"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="critical"
                                checked={editForm.critical}
                                onChange={handleEditChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-700">Mark as critical</label>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Update Report File</label>
                              <input
                                type="file"
                                onChange={handleEditFile}
                                accept=".pdf,.jpg,.png"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md text-sm"
                              >
                                <i className="fas fa-save mr-1"></i>Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md text-sm"
                              >
                                <i className="fas fa-times mr-1"></i>Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(report)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <i className="fas fa-edit mr-1"></i>Edit
                            </button>
                            {report.fileUrl && (
                              <button
                                onClick={() => downloadReport(report.fileUrl)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                              >
                                <i className="fas fa-download mr-1"></i>Download
                              </button>
                            )}
                          </div>
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

export default LabReports;