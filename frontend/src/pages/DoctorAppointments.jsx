import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/doctor/appointments/today', config);
    setAppointments(res.data);
  };

  const updateStatus = async (id, status, notes = '') => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/appointment/${id}/status`, { status, notes }, config);
      fetchAppointments();
      alert('Status updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Today&apos;s Appointments</h1>
          <p className="text-gray-600">Manage your scheduled appointments for today</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-calendar-check text-white"></i>
              </div>
              Appointment Schedule
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
                      <i className="fas fa-clock mr-2"></i>Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-comment-medical mr-2"></i>Reason
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
                  {appointments.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            app.status === 'confirmed' ? 'fa-check-circle' :
                            app.status === 'pending' ? 'fa-clock' :
                            app.status === 'completed' ? 'fa-check-double' :
                            'fa-times-circle'
                          }`}></i>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(app._id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <i className="fas fa-check mr-1"></i>Accept
                            </button>
                            <button
                              onClick={() => updateStatus(app._id, 'cancelled')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <i className="fas fa-times mr-1"></i>Reject
                            </button>
                          </>
                        )}
                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(app._id, 'completed', prompt('Consultation notes'))}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                          >
                            <i className="fas fa-check-double mr-1"></i>Complete
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

export default DoctorAppointments;