import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorLabReports = () => {
  const [reports, setReports] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({ patient: '', testName: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/doctor/lab-reports', config);
    setReports(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const requestTest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/doctor/lab-test', form, config);
      setShowRequest(false);
      setForm({ patient: '', testName: '' });
      fetchReports();
      alert('Test requested');
    } catch (err) {
      alert('Request failed');
    }
  };

  const markCritical = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/lab-report/${id}/critical`, {}, config);
      fetchReports();
      alert('Marked as critical');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lab Reports</h1>
          <p className="text-gray-600">View and manage laboratory test results and requests</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowRequest(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <i className="fas fa-plus mr-2"></i>Request New Lab Test
          </button>
        </div>

        {showRequest && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-flask text-white"></i>
                </div>
                Request Lab Test
              </h2>
            </div>
            <form onSubmit={requestTest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                <input
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                <input
                  name="testName"
                  value={form.testName}
                  onChange={handleChange}
                  placeholder="Enter test name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-paper-plane mr-2"></i>Submit Request
                </button>
                <button
                  onClick={() => setShowRequest(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-file-medical text-white"></i>
              </div>
              Lab Test Results
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
                        <div className="flex items-center space-x-2">
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
                          {report.critical && (
                            <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                              <i className="fas fa-exclamation-triangle mr-1"></i>Critical
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => markCritical(report._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <i className="fas fa-exclamation-triangle mr-1"></i>Mark Critical
                        </button>
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

export default DoctorLabReports;