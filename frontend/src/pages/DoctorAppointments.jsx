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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Today's Appointments</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td className="border px-4 py-2">{app.patient.name}</td>
                <td className="border px-4 py-2">{app.time}</td>
                <td className="border px-4 py-2">{app.reason}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${app.status === 'confirmed' ? 'bg-green-200' : app.status === 'pending' ? 'bg-yellow-200' : 'bg-blue-200'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(app._id, 'confirmed')} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Accept</button>
                      <button onClick={() => updateStatus(app._id, 'cancelled')} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Reject</button>
                    </>
                  )}
                  {app.status === 'confirmed' && (
                    <button onClick={() => updateStatus(app._id, 'completed', prompt('Consultation notes'))} className="bg-blue-500 text-white px-2 py-1 rounded">Mark Completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;