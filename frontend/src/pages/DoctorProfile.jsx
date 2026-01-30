import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/doctor/profile', config);
      setUser(res.data);
      setForm(res.data);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Only send allowed fields
    const updateData = {
      name: form.name,
      phone: form.phone,
      specialization: form.specialization,
      experience: form.experience,
      consultationFee: form.consultationFee
    };

    try {
      const res = await axios.put('http://localhost:5000/api/doctor/profile', updateData, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
              <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
              <input name="specialization" value={form.specialization || ''} onChange={handleChange} placeholder="Specialization" className="p-2 border rounded" />
              <input name="experience" type="number" value={form.experience || ''} onChange={handleChange} placeholder="Experience (years)" className="p-2 border rounded" />
              <input name="consultationFee" type="number" value={form.consultationFee || ''} onChange={handleChange} placeholder="Consultation Fee" className="p-2 border rounded" />
            </div>
            <div className="mt-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Specialization:</strong> {user.specialization}</p>
            <p><strong>Experience:</strong> {user.experience} years</p>
            <p><strong>Consultation Fee:</strong> ${user.consultationFee}</p>
            <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;