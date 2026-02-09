import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaExclamationTriangle, FaUsers, FaCalendarCheck, FaPrescriptionBottleAlt, FaEnvelope, FaPhone, FaEye, FaIdCard } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [emergency, setEmergency] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch user data
      const userRes = await axios.get('/api/auth/me', config);
      setUser(userRes.data);

      const patRes = await axios.get('/api/doctor/patients', config);
      setPatients(patRes.data);
      const emRes = await axios.get('/api/doctor/emergencies', config);
      setEmergency(emRes.data[0] || null); // Get first emergency or null
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="hms-heading-primary text-3xl">Doctor Dashboard</h1>
          <p className="hms-body-text text-gray-600">Manage your patients and medical activities</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/20">
              <FaIdCard className="text-white" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Doctor ID</p>
              <p className="font-mono text-gray-900 font-bold">{user.uniqueId || 'DOC001'}</p>
            </div>
          </div>
        )}
      </div>

      {emergency && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 animate-pulse-custom mx-0">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Emergency Alert!</h3>
              <p className="text-red-700 font-medium">Patient: {emergency.patient.name} - Symptoms: {emergency.symptoms}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <FaUsers />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{patients.length}</p>
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <FaCalendarCheck />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Today&apos;s Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">12</p> {/* Placeholder */}
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <FaPrescriptionBottleAlt />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Prescriptions Issued</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">8</p> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="hms-heading-secondary flex items-center">
            <FaUsers className="text-green-600 mr-2" /> My Patients
          </h2>
          <button className="hms-btn hms-btn-secondary text-xs px-3 py-1">View All</button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="hms-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(pat => (
                <tr key={pat._id} className="group hover:bg-gray-50 transition-colors">
                  <td>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-3">
                        {pat.patient.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{pat.patient.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-500">
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      {pat.patient.email}
                    </div>
                  </td>
                  <td className="text-gray-500">
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-2" />
                      {pat.patient.phone}
                    </div>
                  </td>
                  <td>
                    <button className="hms-btn hms-btn-primary px-3 py-1.5 text-xs flex items-center">
                      <FaEye className="mr-1.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
