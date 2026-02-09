import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaPrescriptionBottleAlt, FaUser, FaStethoscope, FaPills, FaCogs, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ patient: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], diagnosis: '', notes: '' });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/doctor/prescriptions', config);
    setPrescriptions(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...form.medicines];
    newMedicines[index][field] = value;
    setForm({ ...form, medicines: newMedicines });
  };

  const addMedicine = () => setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '' }] });

  const createPrescription = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('/api/doctor/prescription', form, config);
      setShowCreate(false);
      setForm({ patient: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], diagnosis: '', notes: '' });
      fetchPrescriptions();
      alert('Prescription created');
    } catch (err) {
      alert('Creation failed');
    }
  };

  const editPrescription = async (id, updates) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`/api/doctor/prescription/${id}`, updates, config);
      fetchPrescriptions();
      alert('Prescription updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary text-3xl">Prescriptions</h1>
          <p className="hms-body-text text-gray-600">Create and manage patient prescriptions and medications</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="hms-btn hms-btn-primary"
          >
            <FaPlus className="mr-2" />Create New Prescription
          </button>
        </div>

        {showCreate && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="hms-heading-secondary flex items-center mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <FaPrescriptionBottleAlt className="text-white text-xl" />
                </div>
                Create Prescription
              </h2>
            </div>
            <form onSubmit={createPrescription} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Patient ID</label>
                  <input
                    name="patient"
                    value={form.patient}
                    onChange={handleChange}
                    placeholder="Enter patient ID"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Diagnosis</label>
                  <input
                    name="diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    placeholder="Enter diagnosis"
                    className="hms-form-input"
                    required
                  />
                </div>
              </div>
              <div className="hms-form-group mb-0">
                <label className="hms-form-label">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  rows={3}
                  className="hms-form-textarea"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medicines</h3>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="hms-btn hms-btn-secondary py-1 px-3 text-sm"
                  >
                    <FaPlus className="mr-2" />Add Medicine
                  </button>
                </div>
                <div className="space-y-4">
                  {form.medicines.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="hms-form-group mb-0">
                          <label className="hms-form-label text-xs">Name</label>
                          <input
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            placeholder="Medicine name"
                            className="hms-form-input py-2 text-sm"
                          />
                        </div>
                        <div className="hms-form-group mb-0">
                          <label className="hms-form-label text-xs">Dosage</label>
                          <input
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className="hms-form-input py-2 text-sm"
                          />
                        </div>
                        <div className="hms-form-group mb-0">
                          <label className="hms-form-label text-xs">Frequency</label>
                          <input
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            placeholder="e.g., 3 times daily"
                            className="hms-form-input py-2 text-sm"
                          />
                        </div>
                        <div className="hms-form-group mb-0">
                          <label className="hms-form-label text-xs">Duration</label>
                          <input
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                            className="hms-form-input py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="hms-btn hms-btn-primary"
                >
                  <FaSave className="mr-2" />Create Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                >
                  <FaTimes className="mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FaPills className="text-white text-xl" />
              </div>
              Prescription Records
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
                      <div className="flex items-center"><FaStethoscope className="mr-2" />Diagnosis</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaPills className="mr-2" />Medicines</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaCogs className="mr-2" />Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(pres => (
                    <tr key={pres._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="font-medium text-gray-900">{pres.patient.name}</td>
                      <td className="text-gray-600">{pres.diagnosis}</td>
                      <td>
                        <span className="hms-badge hms-badge-info flex items-center w-fit">
                          <FaPills className="mr-1" />
                          {pres.medicines.length} medicine{pres.medicines.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => editPrescription(pres._id, { diagnosis: prompt('New diagnosis', pres.diagnosis) })}
                          className="hms-btn hms-btn-secondary px-3 py-1 text-xs"
                        >
                          <FaEdit className="mr-1" />Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {prescriptions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPrescriptionBottleAlt className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-500">No prescriptions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
