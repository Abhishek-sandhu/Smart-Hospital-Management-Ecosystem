import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSettings = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchLogs();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/profile', config);
    setUser(res.data);
    setForm(res.data);
  };

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/audit-logs', config);
    setLogs(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.put('http://localhost:5000/api/admin/profile', form, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings & Security</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          {editing ? (
            <form onSubmit={handleSubmit}>
              <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" className="block w-full mb-4 p-2 border rounded" />
              <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" className="block w-full mb-4 p-2 border rounded" />
              <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" className="block w-full mb-4 p-2 border rounded" />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Permissions:</strong> {user.permissions?.join(', ')}</p>
              <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
          <div className="max-h-64 overflow-y-auto">
            {logs.slice(0, 10).map(log => (
              <div key={log._id} className="border-b py-2">
                <p><strong>{log.action}</strong> by {log.user?.name} on {new Date(log.timestamp).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;