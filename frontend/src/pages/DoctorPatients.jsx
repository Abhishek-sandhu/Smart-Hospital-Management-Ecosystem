import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/doctor/patients', config);
    setPatients(res.data);
  };

  const searchPatients = async () => {
    if (!search) return fetchPatients();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`http://localhost:5000/api/doctor/patients/search?query=${search}`, config);
    setPatients(res.data);
  };

  const viewHistory = async (patientId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`http://localhost:5000/api/doctor/patient/${patientId}/history`, config);
    setSelectedPatient(res.data);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Patients</h1>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name or email"
          className="w-full p-2 border rounded"
        />
        <button onClick={searchPatients} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Search</button>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(pat => (
              <tr key={pat._id}>
                <td className="border px-4 py-2">{pat.name}</td>
                <td className="border px-4 py-2">{pat.email}</td>
                <td className="border px-4 py-2">{pat.phone}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => viewHistory(pat._id)} className="bg-blue-500 text-white px-2 py-1 rounded">View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPatient && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Patient History</h2>
          <h3 className="text-xl mb-2">Appointments</h3>
          <ul className="list-disc list-inside mb-4">
            {selectedPatient.appointments.map(app => (
              <li key={app._id}>{app.date} - {app.reason} - {app.status}</li>
            ))}
          </ul>
          <h3 className="text-xl mb-2">Prescriptions</h3>
          <ul className="list-disc list-inside mb-4">
            {selectedPatient.prescriptions.map(pres => (
              <li key={pres._id}>{pres.diagnosis} - {pres.medicines.length} medicines</li>
            ))}
          </ul>
          <h3 className="text-xl mb-2">Lab Reports</h3>
          <ul className="list-disc list-inside">
            {selectedPatient.reports.map(rep => (
              <li key={rep._id}>{rep.testName} - {rep.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;