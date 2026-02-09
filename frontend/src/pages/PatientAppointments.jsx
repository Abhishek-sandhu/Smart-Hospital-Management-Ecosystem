import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiX, FiCheck, FiInfo, FiSettings, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { MdLocalHospital, MdComment } from 'react-icons/md';

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
    const res = await axios.get('/api/patient/appointments', config);
    setAppointments(res.data);
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/patient/doctors', config);
    setDoctors(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const bookAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('/api/patient/appointment', form, config);
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
      await axios.put(`/api/patient/appointment/${id}/cancel`, {}, config);
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
      await axios.put(`/api/patient/appointment/${id}/reschedule`, { date, time }, config);
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
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="hms-heading-primary">My Appointments</h1>
            <p className="hms-body-text text-gray-600">Manage your medical appointments and schedule new ones</p>
          </div>
          <button
            onClick={() => setShowBook(true)}
            className="hms-btn hms-btn-primary"
          >
            <FiPlus className="mr-2" />Book New Appointment
          </button>
        </div>

        {showBook && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="hms-heading-secondary flex items-center mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
                    <FiPlus className="text-white text-xl" />
                  </div>
                  Book New Appointment
                </h2>
                <button
                  onClick={() => setShowBook(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <form onSubmit={bookAppointment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">
                      <MdLocalHospital className="inline mr-2 text-blue-600" />Select Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="doctor"
                        value={form.doctor}
                        onChange={handleChange}
                        className="hms-form-select"
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
                  </div>
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">
                      <FiCalendar className="inline mr-2 text-green-600" />Preferred Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="hms-form-input"
                      required
                    />
                  </div>
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">
                      <FiClock className="inline mr-2 text-indigo-600" />Preferred Time
                    </label>
                    <input
                      name="time"
                      type="time"
                      value={form.time}
                      onChange={handleChange}
                      className="hms-form-input"
                      required
                    />
                  </div>
                  <div className="hms-form-group mb-0 md:col-span-2">
                    <label className="hms-form-label">
                      <MdComment className="inline mr-2 text-yellow-600" />Reason for Visit
                    </label>
                    <textarea
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      placeholder="Describe your symptoms or reason for visit"
                      rows="4"
                      className="hms-form-textarea"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="hms-btn hms-btn-primary flex-1 justify-center py-3"
                  >
                    <FiCheck className="mr-2" />Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBook(false)}
                    className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 justify-center py-3"
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
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FiCheck className="text-white text-xl" />
              </div>
              Your Appointments
            </h2>
          </div>

          <div className="p-8">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCalendar className="text-4xl text-gray-300" />
                </div>
                <h3 className="hms-heading-secondary text-gray-900 mb-2">No Appointments Found</h3>
                <p className="hms-body-text text-gray-500 mb-6">You haven&apos;t booked any appointments yet.</p>
                <button
                  onClick={() => setShowBook(true)}
                  className="hms-btn hms-btn-primary"
                >
                  <FiPlus className="mr-2" />Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="flex items-center"><MdLocalHospital className="mr-2" />Doctor</div>
                      </th>
                      <th>
                        <div className="flex items-center"><FiCalendar className="mr-2" />Date</div>
                      </th>
                      <th>
                        <div className="flex items-center"><FiClock className="mr-2" />Time</div>
                      </th>
                      <th>
                        <div className="flex items-center"><FiInfo className="mr-2" />Status</div>
                      </th>
                      <th>
                        <div className="flex items-center"><FiSettings className="mr-2" />Actions</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app._id} className="group hover:bg-gray-50 transition-colors">
                        <td>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                                {app.doctor.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                Dr. {app.doctor.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {app.doctor.specialization}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-gray-700 font-medium">
                          {new Date(app.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="text-gray-700 font-medium font-mono">
                          {app.time}
                        </td>
                        <td>
                          <span className={`hms-badge ${app.status === 'confirmed' ? 'hms-badge-success' :
                            app.status === 'pending' ? 'hms-badge-pending' :
                              app.status === 'cancelled' ? 'hms-badge-error' :
                                'hms-badge-info'
                            }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="space-x-2">
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReschedule(app)}
                                className="hms-btn hms-btn-secondary px-3 py-1.5 text-xs"
                              >
                                <FiCalendar className="mr-1" />Reschedule
                              </button>
                              <button
                                onClick={() => cancelAppointment(app._id)}
                                className="hms-btn bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs shadow-sm"
                              >
                                <FiX className="mr-1" />Cancel
                              </button>
                            </div>
                          )}
                          {app.status === 'confirmed' && (
                            <span className="text-green-600 font-semibold flex items-center text-sm">
                              <FiCheckCircle className="mr-1" />Confirmed
                            </span>
                          )}
                          {app.status === 'cancelled' && (
                            <span className="text-red-500 font-semibold flex items-center text-sm">
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
