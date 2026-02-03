import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPersonAdd, MdScience, MdSave, MdClose, MdPeople, MdPerson, MdEmail, MdBiotech, MdSettings, MdDelete } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lab Staff Management</h1>
          <p className="text-gray-600">Add, view, and manage laboratory staff members in the system</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <MdPersonAdd className="inline mr-2" />Add New Lab Staff
          </button>
        </div>

        {showAdd && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <MdScience className="text-white text-lg" />
                </div>
                Add New Lab Staff
              </h2>
            </div>
            <form onSubmit={addLabStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="staff@example.com"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g., Biochemistry, Hematology"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdSave className="inline mr-2" />Add Lab Staff
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdClose className="inline mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MdPeople className="text-white text-lg" />
              </div>
                Laboratory Staff
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPerson className="inline mr-2" />Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdEmail className="inline mr-2" />Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdBiotech className="inline mr-2" />Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdSettings className="inline mr-2" />Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {labStaff.map(staff => (
                    <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{staff.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{staff.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => removeLabStaff(staff._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <MdDelete className="inline mr-1" />Remove
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

export default AdminLabStaff;