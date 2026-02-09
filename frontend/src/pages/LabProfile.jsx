import { useEffect, useState } from 'react';
import axios from 'axios';

const LabProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/lab/profile', config);
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
    try {
      const res = await axios.put('/api/lab/profile', form, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lab Staff Profile</h1>
          <p className="text-gray-600">Manage your laboratory staff information and settings</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-flask text-white"></i>
              </div>
                Personal Information
            </h2>
          </div>

          <div className="p-8">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      name="department"
                      value={form.department || ''}
                      onChange={handleChange}
                      placeholder="e.g., Biochemistry, Hematology, Microbiology"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <i className="fas fa-save mr-2"></i>Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <i className="fas fa-times mr-2"></i>Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-user text-purple-600 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700">Full Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-envelope text-purple-600 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700">Email Address</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-phone text-purple-600 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700">Phone Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-microscope text-purple-600 mr-2"></i>
                      <span className="text-sm font-medium text-gray-700">Department</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.department || 'Not specified'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                  >
                    <i className="fas fa-edit mr-2"></i>Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabProfile;
