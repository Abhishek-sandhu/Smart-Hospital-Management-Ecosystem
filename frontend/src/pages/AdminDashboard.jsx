import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
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
      const medRes = await axios.get('http://localhost:5000/api/admin/medicines', config);
      setMedicines(medRes.data);
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Admin Dashboard</h1>
        {user && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center">
              <i className="fas fa-id-card mr-3"></i>
              <div>
                <p className="text-sm opacity-80">Admin ID</p>
                <p className="text-lg font-bold font-mono">{user.uniqueId || 'ADM001'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-users text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-user-md text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Doctors</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'doctor').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-flask text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Lab Staff</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'lab').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Emergencies</p>
              <p className="text-2xl font-bold">{emergencies.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="fas fa-chart-bar mr-3 text-blue-500"></i>User Distribution
          </h2>
          <BarChart width={400} height={300} data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="fas fa-users mr-3 text-green-500"></i>Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 5).map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-blue-600">{user.uniqueId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                        user.role === 'lab' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Similar for medicines and emergencies */}
    </div>
  );
};

export default AdminDashboard;