import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaIdCard, FaCalendarCheck, FaPrescriptionBottleAlt, FaMicroscope, FaFileInvoiceDollar, FaCalendarAlt, FaHeartbeat, FaStar } from 'react-icons/fa';

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
      const userRes = await axios.get('/api/auth/me', config);
      setUser(userRes.data);

      const appRes = await axios.get('/api/patient/appointments', config);
      setAppointments(appRes.data);
      const presRes = await axios.get('/api/patient/prescriptions', config);
      setPrescriptions(presRes.data);
      const repRes = await axios.get('/api/patient/lab-reports', config);
      setReports(repRes.data);
      const billRes = await axios.get('/api/patient/bills', config);
      setBills(billRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="hms-heading-primary text-3xl">Patient Dashboard</h1>
          <p className="hms-body-text text-gray-600">Welcome back! Here&apos;s your health overview</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FaIdCard className="text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Patient ID</p>
              <p className="font-mono text-gray-900 font-bold">{user.uniqueId || 'PAT001'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <FaCalendarCheck />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <FaPrescriptionBottleAlt />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{prescriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <FaMicroscope />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lab Reports</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <FaFileInvoiceDollar />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bills</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{bills.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <h2 className="hms-heading-secondary flex items-center mb-6">
            <FaCalendarAlt className="text-blue-600 mr-2" />
            Recent Appointments
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="font-medium text-gray-900">Dr. {app.doctor?.name || 'Unknown'}</td>
                    <td className="text-gray-600">{new Date(app.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`hms-badge ${app.status === 'confirmed' ? 'hms-badge-success' :
                          app.status === 'pending' ? 'hms-badge-warning' :
                            'hms-badge-error'
                        } capitalize`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <p className="text-center text-gray-400 py-8 italic">No recent appointments</p>}
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <h2 className="hms-heading-secondary flex items-center mb-6">
            <FaPrescriptionBottleAlt className="text-green-600 mr-2" />
            Recent Prescriptions
          </h2>
          <div className="space-y-4">
            {prescriptions.slice(0, 4).map((prescription) => (
              <div key={prescription._id} className="group bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-white hover:border-green-200 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {prescription.medicines && prescription.medicines.length > 0 ? prescription.medicines[0].name : 'No medicine'}
                    </h3>
                    <p className="text-sm text-gray-600">Dr. {prescription.doctor?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(prescription.date).toLocaleDateString()}</p>
                  </div>
                  <span className="hms-badge hms-badge-info">
                    {prescription.medicines && prescription.medicines.length > 0 ? prescription.medicines[0].dosage : ''}
                  </span>
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && <p className="text-center text-gray-400 py-8 italic">No recent prescriptions</p>}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <h2 className="hms-heading-secondary flex items-center mb-6">
          <FaHeartbeat className="text-pink-500 mr-2" /> Health Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FaHeartbeat className="text-3xl text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Health Score</h3>
            <p className="text-3xl font-bold text-green-600">85%</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FaCalendarCheck className="text-3xl text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Next Checkup</h3>
            <p className="text-lg font-bold text-blue-600">Mar 15, 2026</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FaStar className="text-3xl text-yellow-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Satisfaction</h3>
            <p className="text-3xl font-bold text-yellow-600">4.8/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
