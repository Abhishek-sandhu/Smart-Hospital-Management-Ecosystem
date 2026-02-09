import { useEffect, useState } from 'react';
import axios from 'axios';

const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    fetchTests();
    fetchDashboard();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/lab/tests', config);
    setTests(res.data);
  };

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/lab/dashboard', config);
    setDashboard(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`/api/lab/test/${id}/status`, { status }, config);
      fetchTests();
      fetchDashboard();
      alert('Status updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Management</h1>
          <p className="text-gray-600">Monitor and manage laboratory test workflows and status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-flask text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tests Today</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboard.totalTests || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{dashboard.pendingTests || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{dashboard.completedTests || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Critical Cases</h3>
            <p className="text-3xl font-bold text-red-600">{dashboard.criticalCases || 0}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-tasks text-white"></i>
              </div>
              Active Tests
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
                  {tests.map(test => (
                    <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{test.testName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          test.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : test.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            test.status === 'pending' ? 'fa-clock' :
                            test.status === 'in-progress' ? 'fa-spinner fa-spin' :
                            'fa-check-circle'
                          }`}></i>
                          {test.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {test.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(test._id, 'in-progress')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-play mr-1"></i>Start
                          </button>
                        )}
                        {test.status === 'in-progress' && (
                          <button
                            onClick={() => updateStatus(test._id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-check mr-1"></i>Complete
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

export default LabTests;
