import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaCogs, FaHistory, FaSearch, FaFileMedical, FaCalendarCheck, FaPills, FaFlask } from 'react-icons/fa';

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
    const res = await axios.get('/api/doctor/patients', config);
    setPatients(res.data);
  };

  const searchPatients = async () => {
    if (!search) return fetchPatients();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`/api/doctor/patients/search?query=${search}`, config);
    setPatients(res.data);
  };

  const viewHistory = async (patientId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(`/api/doctor/patient/${patientId}/history`, config);
    setSelectedPatient(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary text-3xl">My Patients</h1>
          <p className="hms-body-text text-gray-600">Manage and view patient records and medical history</p>
        </div>

        <div className="mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="hms-form-label">Search Patients</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email"
                    className="hms-form-input pl-10"
                  />
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={searchPatients}
                  className="hms-btn hms-btn-primary w-full md:w-auto"
                >
                  <FaSearch className="mr-2" />Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FaUser className="text-white text-xl" />
              </div>
              Patient List
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center"><FaUser className="mr-2" />Name</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaEnvelope className="mr-2" />Email</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaPhone className="mr-2" />Phone</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaCogs className="mr-2" />Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(pat => (
                    <tr key={pat._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="font-medium text-gray-900">{pat.name}</td>
                      <td className="text-gray-600">{pat.email}</td>
                      <td className="font-mono text-gray-600">{pat.phone}</td>
                      <td>
                        <button
                          onClick={() => viewHistory(pat._id)}
                          className="hms-btn hms-btn-primary px-3 py-1 text-xs"
                        >
                          <FaHistory className="mr-1" />View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {patients.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-500">No patients found.</p>
              </div>
            )}
          </div>
        </div>

        {selectedPatient && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h2 className="hms-heading-secondary flex items-center mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <FaFileMedical className="text-white text-xl" />
                </div>
                Patient Medical History
              </h2>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                    <FaCalendarCheck />
                  </div>
                  Appointments
                </h3>
                <div className="space-y-3">
                  {selectedPatient.appointments.map(app => (
                    <div key={app._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{app.date}</p>
                          <p className="text-gray-600">{app.reason}</p>
                        </div>
                        <span className={`hms-badge ${app.status === 'completed' ? 'hms-badge-success' :
                            app.status === 'confirmed' ? 'hms-badge-info' :
                              'hms-badge-warning'
                          }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedPatient.appointments.length === 0 && <p className="text-gray-500 italic">No appointment history.</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-600">
                    <FaPills />
                  </div>
                  Prescriptions
                </h3>
                <div className="space-y-3">
                  {selectedPatient.prescriptions.map(pres => (
                    <div key={pres._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <p className="font-medium text-gray-900">{pres.diagnosis}</p>
                      <p className="text-gray-600">{pres.medicines.length} medicines prescribed</p>
                    </div>
                  ))}
                  {selectedPatient.prescriptions.length === 0 && <p className="text-gray-500 italic">No prescription history.</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 text-purple-600">
                    <FaFlask />
                  </div>
                  Lab Reports
                </h3>
                <div className="space-y-3">
                  {selectedPatient.reports.map(rep => (
                    <div key={rep._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{rep.testName}</p>
                        </div>
                        <span className={`hms-badge ${rep.status === 'completed' ? 'hms-badge-success' : 'hms-badge-warning'
                          }`}>
                          {rep.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedPatient.reports.length === 0 && <p className="text-gray-500 italic">No lab reports found.</p>}
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
