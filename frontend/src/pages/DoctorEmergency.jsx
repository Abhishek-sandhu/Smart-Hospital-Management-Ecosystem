import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorEmergency = () => {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/doctor/emergencies', config);
    setEmergencies(res.data);
  };

  const setPriority = async (id, priority) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/emergency/${id}/priority`, { priority }, config);
      fetchEmergencies();
      alert('Priority updated');
    } catch (err) {
      alert('Failed');
    }
  };

  const handleEmergency = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/emergency/${id}/handle`, {}, config);
      fetchEmergencies();
      alert('Emergency handled');
    } catch (err) {
      alert('Failed');
    }
  };

  const closeEmergency = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/emergency/${id}/close`, {}, config);
      fetchEmergencies();
      alert('Emergency closed');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Queue</h1>
          <p className="text-gray-600">Manage critical patient emergencies and prioritize care</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-ambulance text-white"></i>
              </div>
              Active Emergencies
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
                      <i className="fas fa-stethoscope mr-2"></i>Symptoms
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-exclamation-triangle mr-2"></i>Priority
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
                  {emergencies.map(em => (
                    <tr key={em._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{em.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{em.symptoms}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={em.priority}
                          onChange={(e) => setPriority(em._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          em.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : em.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            em.status === 'resolved' ? 'fa-check-circle' :
                            em.status === 'in-progress' ? 'fa-clock' :
                            'fa-exclamation-triangle'
                          }`}></i>
                          {em.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {em.status === 'waiting' && (
                          <button
                            onClick={() => handleEmergency(em._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-hand-paper mr-1"></i>Handle
                          </button>
                        )}
                        {em.status === 'in-progress' && (
                          <button
                            onClick={() => closeEmergency(em._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-check mr-1"></i>Close
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

export default DoctorEmergency;