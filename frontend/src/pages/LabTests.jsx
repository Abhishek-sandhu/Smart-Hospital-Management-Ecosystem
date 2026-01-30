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
    const res = await axios.get('http://localhost:5000/api/lab/tests', config);
    setTests(res.data);
  };

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/lab/dashboard', config);
    setDashboard(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/lab/test/${id}/status`, { status }, config);
      fetchTests();
      fetchDashboard();
      alert('Status updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Tests Today</h3>
          <p className="text-3xl font-bold text-blue-500">{dashboard.totalTests || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">{dashboard.pendingTests || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{dashboard.completedTests || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Critical Cases</h3>
          <p className="text-3xl font-bold text-red-500">{dashboard.criticalCases || 0}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(test => (
              <tr key={test._id}>
                <td className="border px-4 py-2">{test.patient.name}</td>
                <td className="border px-4 py-2">{test.testName}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${test.status === 'pending' ? 'bg-yellow-200' : test.status === 'in-progress' ? 'bg-blue-200' : 'bg-green-200'}`}>
                    {test.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {test.status === 'pending' && (
                    <button onClick={() => updateStatus(test._id, 'in-progress')} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Start</button>
                  )}
                  {test.status === 'in-progress' && (
                    <button onClick={() => updateStatus(test._id, 'completed')} className="bg-green-500 text-white px-2 py-1 rounded">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTests;