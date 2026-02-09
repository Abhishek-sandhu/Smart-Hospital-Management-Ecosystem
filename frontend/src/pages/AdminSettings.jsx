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
    const res = await axios.get('/api/admin/profile', config);
    setUser(res.data);
    setForm(res.data);
  };

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/admin/audit-logs', config);
    setLogs(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.put('/api/admin/profile', form, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary">Settings & Security</h1>
          <p className="hms-body-text text-gray-600">Manage your profile and view system audit logs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="hms-heading-secondary flex items-center mb-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdAdminPanelSettings className="text-white text-lg" />
                </div>
                Profile Settings
              </h2>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Full Name</label>
                  <input
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Email Address</label>
                  <input
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    type="email"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="hms-form-input"
                  />
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="hms-btn hms-btn-secondary"
                  >
                    <MdSave className="inline mr-2" />Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    className="hms-btn hms-btn-primary"
                  >
                    <MdEdit className="inline mr-2" />Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="hms-heading-secondary flex items-center mb-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <MdHistory className="text-white text-lg" />
                </div>
                Recent Audit Logs
              </h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
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
