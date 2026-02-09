import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileMedical, FaUser, FaFlask, FaInfoCircle, FaExclamationTriangle, FaCogs, FaCheckCircle, FaClock, FaCheck, FaSave, FaTimes, FaEdit, FaDownload, FaFileUpload } from 'react-icons/fa';

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
    const res = await axios.get('/api/lab/reports', config);
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
      await axios.put(`/api/lab/report/${editing}`, formData, {
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
    window.open(`/${fileUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary text-3xl">Reports History</h1>
          <p className="hms-body-text text-gray-600">View and manage laboratory test reports and results</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FaFileMedical className="text-white text-xl" />
              </div>
              Laboratory Reports
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center"><FaUser className="mr-2" />Patient</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaFlask className="mr-2" />Test Name</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaInfoCircle className="mr-2" />Status</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaExclamationTriangle className="mr-2" />Critical</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaCogs className="mr-2" />Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="font-medium text-gray-900">{report.patient.name}</td>
                      <td className="text-gray-600">{report.testName}</td>
                      <td>
                        <span className={`hms-badge ${report.status === 'completed' ? 'hms-badge-success' : 'hms-badge-warning'
                          }`}>
                          {report.status === 'completed' ? <FaCheckCircle className="mr-1" /> : <FaClock className="mr-1" />}
                          {report.status}
                        </span>
                      </td>
                      <td>
                        {report.critical ? (
                          <span className="hms-badge hms-badge-error">
                            <FaExclamationTriangle className="mr-1" />Critical
                          </span>
                        ) : (
                          <span className="hms-badge hms-badge-success bg-gray-100 text-gray-800 border-gray-200">
                            <FaCheck className="mr-1" />Normal
                          </span>
                        )}
                      </td>
                      <td className="space-x-2">
                        {editing === report._id ? (
                          <div className="space-y-3 bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                            <div className="hms-form-group mb-0">
                              <label className="hms-form-label text-xs">Remarks</label>
                              <input
                                name="remarks"
                                value={editForm.remarks}
                                onChange={handleEditChange}
                                placeholder="Enter remarks"
                                className="hms-form-input py-1 text-sm"
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
                            <div className="hms-form-group mb-0">
                              <label className="hms-form-label text-xs">Update Report File</label>
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={handleEditFile}
                                  accept=".pdf,.jpg,.png"
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <button
                                onClick={saveEdit}
                                className="hms-btn hms-btn-primary px-3 py-1 text-xs"
                              >
                                <FaSave className="mr-1" />Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 text-xs"
                              >
                                <FaTimes className="mr-1" />Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(report)}
                              className="hms-btn hms-btn-secondary px-3 py-1 text-xs"
                            >
                              <FaEdit className="mr-1" />Edit
                            </button>
                            {report.fileUrl && (
                              <button
                                onClick={() => downloadReport(report.fileUrl)}
                                className="hms-btn hms-btn-primary bg-green-600 hover:bg-green-700 from-green-500 to-green-600 border-none px-3 py-1 text-xs"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                              >
                                <FaDownload className="mr-1" />Download
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
            {reports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileMedical className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-500">No lab reports found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReports;
