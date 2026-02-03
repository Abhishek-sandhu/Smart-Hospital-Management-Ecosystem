import { useEffect, useState } from 'react';
import axios from 'axios';

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
    const res = await axios.get('http://localhost:5000/api/doctor/prescriptions', config);
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
      await axios.post('http://localhost:5000/api/doctor/prescription', form, config);
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
      await axios.put(`http://localhost:5000/api/doctor/prescription/${id}`, updates, config);
      fetchPrescriptions();
      alert('Prescription updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prescriptions</h1>
          <p className="text-gray-600">Create and manage patient prescriptions and medications</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <i className="fas fa-plus mr-2"></i>Create New Prescription
          </button>
        </div>

        {showCreate && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-prescription text-white"></i>
                </div>
                Create Prescription
              </h2>
            </div>
            <form onSubmit={createPrescription} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    name="patient"
                    value={form.patient}
                    onChange={handleChange}
                    placeholder="Enter patient ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <input
                    name="diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    placeholder="Enter diagnosis"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medicines</h3>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  >
                    <i className="fas fa-plus mr-2"></i>Add Medicine
                  </button>
                </div>
                <div className="space-y-4">
                  {form.medicines.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            placeholder="Medicine name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                          <input
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <input
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            placeholder="e.g., 3 times daily"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          <input
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-save mr-2"></i>Create Prescription
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-times mr-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-pills text-white"></i>
              </div>
              Prescription Records
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
                      <i className="fas fa-stethoscope mr-2"></i>Diagnosis
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-pills mr-2"></i>Medicines
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <i className="fas fa-cogs mr-2"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescriptions.map(pres => (
                    <tr key={pres._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pres.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pres.diagnosis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <i className="fas fa-pills mr-1"></i>
                          {pres.medicines.length} medicine{pres.medicines.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editPrescription(pres._id, { diagnosis: prompt('New diagnosis', pres.diagnosis) })}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
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

export default DoctorPrescriptions;