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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">Manage and view patient records and medical history</p>
        </div>

        <div className="mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Patients</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchPatients}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-search mr-2"></i>Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-users text-white"></i>
              </div>
              Patient List
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-user mr-2"></i>Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-envelope mr-2"></i>Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-phone mr-2"></i>Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-cogs mr-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map(pat => (
                    <tr key={pat._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pat.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pat.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pat.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewHistory(pat._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <i className="fas fa-history mr-1"></i>View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedPatient && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-file-medical text-white"></i>
                </div>
                Patient Medical History
              </h2>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-calendar-check text-white text-sm"></i>
                  </div>
                  Appointments
                </h3>
                <div className="space-y-3">
                  {selectedPatient.appointments.map(app => (
                    <div key={app._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{app.date}</p>
                          <p className="text-gray-600">{app.reason}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          app.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-pills text-white text-sm"></i>
                  </div>
                  Prescriptions
                </h3>
                <div className="space-y-3">
                  {selectedPatient.prescriptions.map(pres => (
                    <div key={pres._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">{pres.diagnosis}</p>
                      <p className="text-gray-600">{pres.medicines.length} medicines prescribed</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-flask text-white text-sm"></i>
                  </div>
                  Lab Reports
                </h3>
                <div className="space-y-3">
                  {selectedPatient.reports.map(rep => (
                    <div key={rep._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{rep.testName}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          rep.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;