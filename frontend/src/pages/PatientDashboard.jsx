import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [bills, setBills] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch user data
      const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(userRes.data);

      const appRes = await axios.get('http://localhost:5000/api/patient/appointments', config);
      setAppointments(appRes.data);
      const presRes = await axios.get('http://localhost:5000/api/patient/prescriptions', config);
      setPrescriptions(presRes.data);
      const repRes = await axios.get('http://localhost:5000/api/patient/lab-reports', config);
      setReports(repRes.data);
      const billRes = await axios.get('http://localhost:5000/api/patient/bills', config);
      setBills(billRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Patient Dashboard</h1>
        {user && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center">
              <i className="fas fa-id-card mr-3"></i>
              <div>
                <p className="text-sm opacity-80">Patient ID</p>
                <p className="text-lg font-bold font-mono">{user.uniqueId || 'PAT001'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-calendar-check text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Appointments</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-prescription text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Prescriptions</p>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-microscope text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Lab Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-dollar-sign text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Bills</p>
              <p className="text-2xl font-bold">{bills.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <i className="fas fa-calendar-alt mr-3 text-blue-500"></i>Recent Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.slice(0, 5).map(app => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Similar enhanced sections for prescriptions, reports, bills */}
    </div>
  );
};

export default PatientDashboard;