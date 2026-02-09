import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdCreditCard, MdPeople, MdLocalHospital, MdScience, MdWarning, MdBarChart, MdPerson, MdPersonOutline, MdEmail, MdArrowUpward } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const userRes = await axios.get('/api/auth/me', config);
      setUser(userRes.data);

      const adminUserRes = await axios.get('/api/admin/users', config);
      setUsers(adminUserRes.data);
      const emRes = await axios.get('/api/admin/emergencies', config);
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="hms-heading-primary text-3xl">Dashboard Overview</h1>
          <p className="hms-body-text text-gray-600">Welcome back, <span className="text-blue-600 font-semibold">{user?.name}</span>. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20">
            <MdCreditCard className="text-white" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Admin ID</p>
            <p className="font-mono text-gray-900 font-bold">{user?.uniqueId || '---'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hms-stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <MdPeople />
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <MdArrowUpward className="mr-1" /> 12%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
        </div>

        <div className="hms-stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <MdLocalHospital />
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <MdArrowUpward className="mr-1" /> 5%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Doctors</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === 'doctor').length}</p>
          </div>
        </div>

        <div className="hms-stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <MdScience />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Lab Staff</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === 'lab').length}</p>
          </div>
        </div>

        <div className="hms-stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 animate-pulse-custom">
                <MdWarning />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Emergencies</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{emergencies.length}</p>
          </div>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="hms-heading-secondary text-xl font-bold text-gray-800 mb-6 flex items-center">
            <MdBarChart className="mr-2 text-blue-600" /> User Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="hms-heading-secondary text-xl font-bold text-gray-800 flex items-center">
              <MdPeople className="mr-2 text-green-600" /> Recent Users
            </h2>
            <button className="hms-btn hms-btn-secondary text-xs px-3 py-1">View All</button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                    <td>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs mr-3 border border-gray-200">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`hms-badge ${user.role === 'admin' ? 'hms-badge-error' :
                          user.role === 'doctor' ? 'hms-badge-success' :
                            user.role === 'lab' ? 'hms-badge-warning' :
                              'hms-badge-info'
                        } capitalize`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-gray-500">{user.email}</td>
                    <td>
                      <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{user.uniqueId}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
