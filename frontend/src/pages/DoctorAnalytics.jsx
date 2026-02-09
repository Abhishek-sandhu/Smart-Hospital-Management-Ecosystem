import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const DoctorAnalytics = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/doctor/analytics', config);
    setAnalytics(res.data);
  };

  const data = [
    { name: 'Patients per Day', value: analytics.todaysAppointments || 0 },
    { name: 'Total Patients', value: analytics.totalPatients || 0 },
    { name: 'Emergencies Handled', value: analytics.emergenciesHandled || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your performance metrics and patient statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-check text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today&apos;s Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.todaysAppointments || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.totalPatients || 0}</p>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xl"></i>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergencies Handled</h3>
            <p className="text-3xl font-bold text-red-600">{analytics.emergenciesHandled || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-chart-bar text-white"></i>
                </div>
                Performance Metrics
              </h3>
            </div>
            <BarChart width={500} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-chart-pie text-white"></i>
                </div>
                Data Distribution
              </h3>
            </div>
            <PieChart width={500} height={300}>
              <Pie
                data={data}
                cx={250}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalytics;
