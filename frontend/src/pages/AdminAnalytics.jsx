import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiDollarSign, FiBarChart, FiPieChart } from 'react-icons/fi';
import { MdLocalHospital, MdHotel } from 'react-icons/md';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/analytics', config);
    setAnalytics(res.data);
  };

  const data = [
    { name: 'Users', value: analytics.totalUsers || 0 },
    { name: 'Doctors', value: analytics.totalDoctors || 0 },
    { name: 'Patients', value: analytics.totalPatients || 0 },
    { name: 'Lab Staff', value: analytics.totalLabStaff || 0 },
    { name: 'Appointments', value: analytics.totalAppointments || 0 },
    { name: 'Tests', value: analytics.totalTests || 0 },
    { name: 'Emergencies', value: analytics.totalEmergencies || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of healthcare system performance and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiUsers className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <MdLocalHospital className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.totalDoctors || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <MdHotel className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.totalPatients || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">${analytics.revenue || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <FiBarChart className="text-white" />
                </div>
                System Metrics Overview
              </h3>
            </div>
            <BarChart width={500} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <FiPieChart className="text-white" />
                </div>
                User Distribution
              </h3>
            </div>
            <PieChart width={500} height={300}>
              <Pie
                data={data.slice(0, 4)}
                cx={250}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.slice(0, 4).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;