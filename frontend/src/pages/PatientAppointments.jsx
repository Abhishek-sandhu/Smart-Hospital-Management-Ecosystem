import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ doctor: '', date: '', time: '', reason: '' });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/patient/appointments', config);
    setAppointments(res.data);
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/patient/doctors', config);
    setDoctors(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const bookAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/patient/appointment', form, config);
      setShowBook(false);
      setForm({ doctor: '', date: '', time: '', reason: '' });
      fetchAppointments();
      alert('Appointment booked');
    } catch (err) {
      alert('Booking failed');
    }
  };

  const cancelAppointment = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/patient/appointment/${id}/cancel`, {}, config);
      fetchAppointments();
      alert('Appointment cancelled');
    } catch (err) {
      alert('Cancel failed');
    }
  };

  const rescheduleAppointment = async (id, date, time) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/patient/appointment/${id}/reschedule`, { date, time }, config);
      fetchAppointments();
      alert('Appointment rescheduled');
    } catch (err) {
      alert('Reschedule failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">My Appointments</h1>
        <p className="text-gray-600">Manage your medical appointments and schedule new ones</p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setShowBook(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <i className="fas fa-calendar-plus mr-3"></i>Book New Appointment
        </button>
      </div>

      {showBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl transform scale-100 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-calendar-plus mr-3 text-blue-500"></i>Book New Appointment
              </h2>
              <button
                onClick={() => setShowBook(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <form onSubmit={bookAppointment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <i className="fas fa-user-md mr-2 text-blue-500"></i>Select Doctor
                  </label>
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <i className="fas fa-calendar mr-2 text-green-500"></i>Preferred Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <i className="fas fa-clock mr-2 text-purple-500"></i>Preferred Time
                  </label>
                  <input
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <i className="fas fa-comment-medical mr-2 text-red-500"></i>Reason for Visit
                  </label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-check mr-2"></i>Book Appointment
                </button>
                <button
                  onClick={() => setShowBook(false)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <i className="fas fa-calendar-check mr-3"></i>Your Appointments
          </h2>
        </div>

        <div className="p-8">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Appointments Found</h3>
              <p className="text-gray-500">You haven't booked any appointments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-user-md mr-2"></i>Doctor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-calendar mr-2"></i>Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-clock mr-2"></i>Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-info-circle mr-2"></i>Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="fas fa-cogs mr-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                              <i className="fas fa-user-md text-white text-sm"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {app.doctor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.doctor.specialization}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(app.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            app.status === 'confirmed'
                              ? 'fa-check-circle'
                              : app.status === 'pending'
                              ? 'fa-clock'
                              : app.status === 'cancelled'
                              ? 'fa-times-circle'
                              : 'fa-question-circle'
                          }`}></i>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => cancelAppointment(app._id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <i className="fas fa-times mr-1"></i>Cancel
                            </button>
                            <button
                              onClick={() => {
                                const newDate = prompt('Enter new date (YYYY-MM-DD):', app.date.split('T')[0]);
                                const newTime = prompt('Enter new time (HH:MM):', app.time);
                                if (newDate && newTime) {
                                  rescheduleAppointment(app._id, newDate, newTime);
                                }
                              }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <i className="fas fa-calendar-alt mr-1"></i>Reschedule
                            </button>
                          </>
                        )}
                        {app.status === 'confirmed' && (
                          <span className="text-green-600 font-semibold">
                            <i className="fas fa-check-circle mr-1"></i>Confirmed
                          </span>
                        )}
                        {app.status === 'cancelled' && (
                          <span className="text-red-600 font-semibold">
                            <i className="fas fa-times-circle mr-1"></i>Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;