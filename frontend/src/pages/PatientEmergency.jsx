import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientEmergency = () => {
  const [emergency, setEmergency] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.get('http://localhost:5000/api/patient/emergency/status', config);
      setEmergency(res.data);
    } catch (err) {
      // No emergency
    }
  };

  const requestEmergency = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.post('http://localhost:5000/api/patient/emergency', { symptoms }, config);
      setEmergency(res.data);
      alert('Emergency request submitted');
    } catch (err) {
      alert('Request failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Emergency Services</h1>
      {!emergency ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Request Emergency Assistance</h2>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms"
            className="w-full p-4 border rounded mb-4"
            rows="4"
          ></textarea>
          <button onClick={requestEmergency} className="bg-red-500 text-white px-6 py-3 rounded font-semibold">Request Emergency</button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Emergency Status</h2>
          <p><strong>Status:</strong> {emergency.status}</p>
          <p><strong>Symptoms:</strong> {emergency.symptoms}</p>
          <p><strong>Priority:</strong> {emergency.priority}</p>
          {emergency.assignedDoctor && <p><strong>Assigned Doctor:</strong> {emergency.assignedDoctor}</p>}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-4">
              <div className={`h-4 rounded-full ${emergency.status === 'resolved' ? 'bg-green-500 w-full' : emergency.status === 'in-progress' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}></div>
            </div>
            <p className="text-sm mt-2">Queue Position: {emergency.status === 'waiting' ? 'In queue' : 'Processing'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientEmergency;