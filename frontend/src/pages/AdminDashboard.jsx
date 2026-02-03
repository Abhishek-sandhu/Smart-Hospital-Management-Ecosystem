import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdCreditCard, MdPeople, MdLocalHospital, MdScience, MdWarning, MdBarChart, MdPerson, MdPersonOutline, MdEmail } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch current admin user data
      const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(userRes.data);

      const adminUserRes = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(adminUserRes.data);
      const emRes = await axios.get('http://localhost:5000/api/admin/emergencies', config);
      setEmergencies(emRes.data);
    };
    fetchData();
  }, []);

  const userData = [
    { name: 'Patients', count: users.filter(u => u.role === 'patient').length },
    { name: 'Doctors', count: users.filter(u => u.role === 'doctor').length },
    { name: 'Admins', count: users.filter(u => u.role === 'admin').length },
    { name: 'Lab Staff', count: users.filter(u => u.role === 'lab').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage hospital operations and oversee all activities</p>
          </div>
          {user && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <MdCreditCard className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin ID</p>
                  <p className="text-lg font-bold font-mono text-gray-900">{user.uniqueId || 'ADM001'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <MdPeople className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <MdLocalHospital className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'doctor').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
              <MdScience className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lab Staff</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'lab').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
              <MdWarning className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergencies</p>
              <p className="text-2xl font-bold text-gray-900">{emergencies.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <MdBarChart className="text-white text-lg" />
            </div>
            User Distribution
          </h2>
          <BarChart width={400} height={300} data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <MdPeople className="text-white text-lg" />
            </div>
            Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    <MdCreditCard className="inline mr-2" />ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    <MdPerson className="inline mr-2" />Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    <MdPersonOutline className="inline mr-2" />Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    <MdEmail className="inline mr-2" />Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.slice(0, 5).map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-600">{user.uniqueId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                        user.role === 'lab' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        <i className={`fas mr-1 ${
                          user.role === 'admin' ? 'fa-crown' :
                          user.role === 'doctor' ? 'fa-user-md' :
                          user.role === 'lab' ? 'fa-flask' :
                          'fa-user'
                        }`}></i>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Similar for medicines and emergencies */}
    </div>
    </div>
  );
};

export default AdminDashboard;