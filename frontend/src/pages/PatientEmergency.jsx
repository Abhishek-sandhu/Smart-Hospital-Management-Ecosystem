import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdLocalHospital, MdWarning, MdComment, MdInfo, MdLocalShipping, MdPerson } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Services</h1>
          <p className="text-gray-600">Request emergency medical assistance when needed</p>
        </div>

        {!emergency ? (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Emergency Assistance</h2>
              <p className="text-gray-600">Please describe your symptoms in detail so we can provide appropriate care.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <MdComment className="inline mr-2 text-red-600" />Symptoms Description
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms, pain level, and any other relevant information..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 shadow-sm resize-none"
                  rows="6"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={requestEmergency}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <MdWarning className="inline mr-2" />Request Emergency
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <MdLocalShipping className="text-white" />
                </div>
                Emergency Status
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MdInfo className="text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Status</span>
                </div>
                <p className="text-gray-900 font-medium capitalize">{emergency.status}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MdWarning className="text-yellow-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Priority</span>
                </div>
                <p className="text-gray-900 font-medium capitalize">{emergency.priority}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center mb-2">
                  <MdComment className="text-red-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Symptoms</span>
                </div>
                <p className="text-gray-900">{emergency.symptoms}</p>
              </div>
              {emergency.assignedDoctor && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MdPerson className="text-green-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Assigned Doctor</span>
                  </div>
                  <p className="text-gray-900 font-medium">{emergency.assignedDoctor}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div className={`h-4 rounded-full transition-all duration-500 ${
                  emergency.status === 'resolved'
                    ? 'bg-green-500 w-full'
                    : emergency.status === 'in-progress'
                    ? 'bg-yellow-500 w-2/3'
                    : 'bg-red-500 w-1/3'
                }`}></div>
              </div>
              <p className="text-sm text-gray-600">
                Queue Position: {emergency.status === 'waiting' ? 'In queue' : emergency.status === 'in-progress' ? 'Being processed' : 'Completed'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientEmergency;