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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prescriptions</h1>
      <button onClick={() => setShowCreate(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Create New Prescription</button>
      {showCreate && (
        <form onSubmit={createPrescription} className="bg-white p-6 rounded shadow mb-6">
          <input name="patient" value={form.patient} onChange={handleChange} placeholder="Patient ID" className="block w-full mb-4 p-2 border rounded" />
          <input name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Diagnosis" className="block w-full mb-4 p-2 border rounded" />
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="block w-full mb-4 p-2 border rounded"></textarea>
          <h3 className="text-lg font-semibold mt-4 mb-2">Medicines</h3>
          {form.medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <input value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} placeholder="Name" className="p-2 border rounded" />
              <input value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} placeholder="Dosage" className="p-2 border rounded" />
              <input value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} placeholder="Frequency" className="p-2 border rounded" />
              <input value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} placeholder="Duration" className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={addMedicine} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Add Medicine</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Create</button>
          <button onClick={() => setShowCreate(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Diagnosis</th>
              <th className="px-4 py-2">Medicines</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(pres => (
              <tr key={pres._id}>
                <td className="border px-4 py-2">{pres.patient.name}</td>
                <td className="border px-4 py-2">{pres.diagnosis}</td>
                <td className="border px-4 py-2">{pres.medicines.length}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => editPrescription(pres._id, { diagnosis: prompt('New diagnosis', pres.diagnosis) })} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;