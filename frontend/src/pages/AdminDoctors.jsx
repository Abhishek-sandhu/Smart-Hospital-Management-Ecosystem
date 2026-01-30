import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '', consultationFee: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/users', config);
    setDoctors(res.data.filter(u => u.role === 'doctor'));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/admin/doctor', form, config);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', specialization: '', experience: '', consultationFee: '' });
      fetchDoctors();
      alert('Doctor added');
    } catch (err) {
      alert('Failed');
    }
  };

  const removeDoctor = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:5000/api/admin/doctor/${id}`, config);
      fetchDoctors();
      alert('Doctor removed');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Doctor Management</h1>
      <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Doctor</button>
      {showAdd && (
        <form onSubmit={addDoctor} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="p-2 border rounded" required />
            <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="p-2 border rounded" required />
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience (years)" type="number" className="p-2 border rounded" required />
            <input name="consultationFee" value={form.consultationFee} onChange={handleChange} placeholder="Consultation Fee" type="number" className="p-2 border rounded" required />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2 mt-4">Add</button>
          <button onClick={() => setShowAdd(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Specialization</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Fee</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor._id}>
                <td className="border px-4 py-2">{doctor.name}</td>
                <td className="border px-4 py-2">{doctor.email}</td>
                <td className="border px-4 py-2">{doctor.specialization}</td>
                <td className="border px-4 py-2">{doctor.experience} years</td>
                <td className="border px-4 py-2">${doctor.consultationFee}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => removeDoctor(doctor._id)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;