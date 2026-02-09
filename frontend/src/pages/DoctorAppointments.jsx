import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarCheck, FaUser, FaClock, FaNotesMedical, FaInfoCircle, FaCogs, FaCheckCircle, FaCheckDouble, FaTimesCircle, FaCheck, FaTimes } from 'react-icons/fa';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/doctor/appointments/today', config);
    setAppointments(res.data);
  };

  const updateStatus = async (id, status, notes = '') => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`/api/doctor/appointment/${id}/status`, { status, notes }, config);
      fetchAppointments();
      alert('Status updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary">Today&apos;s Appointments</h1>
          <p className="hms-body-text text-gray-600">Manage your scheduled appointments for today</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FaCalendarCheck className="text-white text-xl" />
              </div>
              Appointment Schedule
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center"><FaUser className="mr-2" />Patient</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaClock className="mr-2" />Time</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaNotesMedical className="mr-2" />Reason</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaInfoCircle className="mr-2" />Status</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaCogs className="mr-2" />Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="font-medium text-gray-900">{app.patient.name}</td>
                      <td className="font-mono text-gray-600">{app.time}</td>
                      <td className="text-gray-600 italic">{app.reason}</td>
                      <td>
                        <span className={`hms-badge ${app.status === 'confirmed' ? 'hms-badge-success' :
                          app.status === 'pending' ? 'hms-badge-pending' :
                            app.status === 'completed' ? 'hms-badge-info' :
                              'hms-badge-error'
                          }`}>
                          {app.status === 'confirmed' ? <FaCheckCircle className="mr-1" /> :
                            app.status === 'pending' ? <FaClock className="mr-1" /> :
                              app.status === 'completed' ? <FaCheckDouble className="mr-1" /> :
                                <FaTimesCircle className="mr-1" />}
                          {app.status}
                        </span>
                      </td>
                      <td className="space-x-2">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(app._id, 'confirmed')}
                              className="hms-btn hms-btn-secondary px-3 py-1 text-xs"
                            >
                              <FaCheck className="mr-1" />Accept
                            </button>
                            <button
                              onClick={() => updateStatus(app._id, 'cancelled')}
                              className="hms-btn bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1 text-xs shadow-sm"
                            >
                              <FaTimes className="mr-1" />Reject
                            </button>
                          </div>
                        )}
                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(app._id, 'completed', prompt('Consultation notes'))}
                            className="hms-btn hms-btn-primary px-3 py-1 text-xs"
                          >
                            <FaCheckDouble className="mr-1" />Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {appointments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarCheck className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-500">No appointments scheduled for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
