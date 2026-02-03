import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiX, FiCheck, FiInfo, FiSettings, FiUser, FiCheckCircle } from 'react-icons/fi';
import { MdLocalHospital, MdComment } from 'react-icons/md';
import { FiCalendar, FiClock } from 'react-icons/fi';

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

  const handleReschedule = (app) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', app.date.split('T')[0]);
    const newTime = prompt('Enter new time (HH:MM):', app.time);
    if (newDate && newTime) {
      rescheduleAppointment(app._id, newDate, newTime);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments and schedule new ones</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowBook(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-sm hover:shadow-md transition-colors"
          >
            <FiPlus className="mr-2" />Book New Appointment
          </button>
        </div>

        {showBook && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <FiPlus className="text-white" />
                  </div>
                  Book New Appointment
                </h2>
                <button
                  onClick={() => setShowBook(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <form onSubmit={bookAppointment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      <MdLocalHospital className="inline mr-2 text-blue-600" />Select Doctor
                    </label>
                    <select
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
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
                    <label className="block text-sm font-semibold text-gray-900">
                      <FiCalendar className="inline mr-2 text-green-600" />Preferred Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      <FiClock className="inline mr-2 text-indigo-600" />Preferred Time
                    </label>
                    <input
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      <MdComment className="inline mr-2 text-yellow-600" />Reason for Visit
                    </label>
                    <textarea
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      placeholder="Describe your symptoms or reason for visit"
                      rows="4"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FiCheck className="mr-2" />Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBook(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FiX className="mr-2" />Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FiCheck className="text-white" />
              </div>
              Your Appointments
            </h2>
          </div>

          <div className="p-8">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiX className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                <p className="text-gray-600">You haven&apos;t booked any appointments yet.</p>
                <button
                  onClick={() => setShowBook(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FiPlus className="mr-2" />Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <MdLocalHospital className="mr-2" />Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <FiCalendar className="mr-2" />Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <FiClock className="mr-2" />Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <FiInfo className="mr-2" />Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <FiSettings className="mr-2" />Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <MdLocalHospital className="text-white text-sm" />
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
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
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
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                              >
                                <FiX className="mr-1" />Cancel
                              </button>
                              <button
                                onClick={() => handleReschedule(app)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                              >
                                <FiCalendar className="mr-1" />Reschedule
                              </button>
                            </>
                          )}
                          {app.status === 'confirmed' && (
                            <span className="text-green-600 font-semibold flex items-center">
                              <FiCheckCircle className="mr-1" />Confirmed
                            </span>
                          )}
                          {app.status === 'cancelled' && (
                            <span className="text-red-600 font-semibold flex items-center">
                              <FiX className="mr-1" />Cancelled
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
    </div>
  );
};

export default PatientAppointments;