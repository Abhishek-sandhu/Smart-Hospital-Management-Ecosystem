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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your health overview</p>
          </div>
          {user && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-6 py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-id-card text-white text-lg"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="text-lg font-semibold text-gray-900">{user.uniqueId || 'PAT001'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-calendar-check text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-prescription text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-microscope text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lab Reports</p>
                <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-dollar-sign text-white text-2xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bills</p>
                <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-calendar-alt text-white"></i>
              </div>
              Recent Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.slice(0, 5).map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.doctor.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-prescription text-white"></i>
              </div>
              Recent Prescriptions
            </h2>
            <div className="space-y-4">
              {prescriptions.slice(0, 4).map((prescription) => (
                <div key={prescription._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{prescription.medicine.name}</h3>
                      <p className="text-sm text-gray-600">Dr. {prescription.doctor.name}</p>
                      <p className="text-xs text-gray-500">{new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {prescription.dosage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-chart-line text-white"></i>
            </div>
            Health Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heartbeat text-2xl text-white"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Health Score</h3>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-check text-2xl text-white"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Next Checkup</h3>
              <p className="text-lg font-semibold text-gray-900">Mar 15, 2026</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl text-white"></i>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Satisfaction</h3>
              <p className="text-2xl font-bold text-gray-900">4.8/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;