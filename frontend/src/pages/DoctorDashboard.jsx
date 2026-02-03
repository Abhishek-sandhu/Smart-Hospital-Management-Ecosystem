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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">Manage your patients and medical activities</p>
          </div>
          {user && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-id-card text-white"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor ID</p>
                  <p className="text-lg font-bold font-mono text-gray-900">{user.uniqueId || 'DOC001'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {emergency && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900">Emergency Alert!</h3>
                <p className="text-red-700">Patient: {emergency.patient.name} - Symptoms: {emergency.symptoms}</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-calendar-check text-white text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Today&apos;s Appointments</p>
              <p className="text-2xl font-bold text-gray-900">12</p> {/* Placeholder */}
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-prescription text-white text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prescriptions Today</p>
              <p className="text-2xl font-bold text-gray-900">8</p> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <i className="fas fa-users text-white"></i>
          </div>
          My Patients
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-user mr-2"></i>Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-envelope mr-2"></i>Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-phone mr-2"></i>Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-cogs mr-2"></i>Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map(pat => (
                <tr key={pat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pat.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pat.patient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pat.patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
                      <i className="fas fa-eye mr-2"></i>View Details
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
    </div>
  );
};

export default DoctorDashboard;