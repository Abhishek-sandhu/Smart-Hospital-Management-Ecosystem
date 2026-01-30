import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminLabStaff = () => {
  const [labStaff, setLabStaff] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });

  useEffect(() => {
    fetchLabStaff();
  }, []);

  const fetchLabStaff = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/users', config);
    setLabStaff(res.data.filter(u => u.role === 'lab'));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addLabStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/admin/lab-staff', form, config);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', department: '' });
      fetchLabStaff();
      alert('Lab staff added');
    } catch (err) {
      alert('Failed');
    }
  };

  const removeLabStaff = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:5000/api/admin/lab-staff/${id}`, config);
      fetchLabStaff();
      alert('Lab staff removed');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lab Staff Management</h1>
      <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Lab Staff</button>
      {showAdd && (
        <form onSubmit={addLabStaff} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="p-2 border rounded" required />
            <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="p-2 border rounded" required />
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
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labStaff.map(staff => (
              <tr key={staff._id}>
                <td className="border px-4 py-2">{staff.name}</td>
                <td className="border px-4 py-2">{staff.email}</td>
                <td className="border px-4 py-2">{staff.department}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => removeLabStaff(staff._id)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLabStaff;