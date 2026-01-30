import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [emergency, setEmergency] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch user data
      const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(userRes.data);

      const patRes = await axios.get('http://localhost:5000/api/doctor/patients', config);
      setPatients(patRes.data);
      const emRes = await axios.get('http://localhost:5000/api/doctor/emergencies', config);
      setEmergency(emRes.data[0] || null); // Get first emergency or null
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Doctor Dashboard</h1>
        {user && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center">
              <i className="fas fa-id-card mr-3"></i>
              <div>
                <p className="text-sm opacity-80">Doctor ID</p>
                <p className="text-lg font-bold font-mono">{user.uniqueId || 'DOC001'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {emergency && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg mb-8 animate-pulse">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-3xl mr-4"></i>
            <div>
              <h3 className="text-lg font-bold">Emergency Alert!</h3>
              <p className="text-sm opacity-90">Patient: {emergency.patient.name} - Symptoms: {emergency.symptoms}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-users text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-calendar-check text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Today's Appointments</p>
              <p className="text-2xl font-bold">12</p> {/* Placeholder */}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-prescription text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Prescriptions Today</p>
              <p className="text-2xl font-bold">8</p> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-users mr-3 text-green-500"></i>My Patients
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map(pat => (
                <tr key={pat._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pat.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pat.patient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pat.patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors duration-200">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Form for prescription */}
    </div>
  );
};

export default DoctorDashboard;