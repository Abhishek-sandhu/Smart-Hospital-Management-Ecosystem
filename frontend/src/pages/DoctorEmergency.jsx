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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Emergency Queue</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Symptoms</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencies.map(em => (
              <tr key={em._id}>
                <td className="border px-4 py-2">{em.patient.name}</td>
                <td className="border px-4 py-2">{em.symptoms}</td>
                <td className="border px-4 py-2">
                  <select value={em.priority} onChange={(e) => setPriority(em._id, e.target.value)} className="p-1 border rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${em.status === 'resolved' ? 'bg-green-200' : em.status === 'in-progress' ? 'bg-yellow-200' : 'bg-red-200'}`}>
                    {em.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {em.status === 'waiting' && (
                    <button onClick={() => handleEmergency(em._id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Handle</button>
                  )}
                  {em.status === 'in-progress' && (
                    <button onClick={() => closeEmergency(em._id)} className="bg-green-500 text-white px-2 py-1 rounded">Close</button>
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

export default DoctorEmergency;