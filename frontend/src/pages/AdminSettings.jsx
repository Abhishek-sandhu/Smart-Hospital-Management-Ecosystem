import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdAdminPanelSettings, MdSave, MdClose, MdEdit, MdHistory, MdInbox } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings & Security</h1>
          <p className="text-gray-600">Manage your profile and view system audit logs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdAdminPanelSettings className="text-white text-lg" />
                </div>
                Profile Settings
              </h2>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <MdSave className="inline mr-2" />Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <MdClose className="inline mr-2" />Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Full Name</span>
                  <span className="text-sm text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Email Address</span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Phone Number</span>
                  <span className="text-sm text-gray-900">{user.phone}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Permissions</span>
                  <span className="text-sm text-gray-900">{user.permissions?.join(', ')}</span>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <MdEdit className="inline mr-2" />Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <MdHistory className="text-white text-lg" />
                </div>
                Recent Audit Logs
              </h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {logs.slice(0, 10).map(log => (
                <div key={log._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{log.action}</span>
                    <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">User:</span> {log.user?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Details:</span> {log.details}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MdInbox className="text-4xl mb-4 mx-auto" />
                  <p>No audit logs available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;