import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(res.data);
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="w-64 bg-gradient-to-b from-red-600 to-red-800 shadow-2xl">
        <div className="p-6 border-b border-red-500">
          <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
          {user && <p className="text-sm text-red-200">{user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/admin" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
          </Link>
          <Link to="/admin/users" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-users mr-3"></i>Users
          </Link>
          <Link to="/admin/doctors" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-user-md mr-3"></i>Doctors
          </Link>
          <Link to="/admin/lab-staff" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-flask mr-3"></i>Lab Staff
          </Link>
          <Link to="/admin/inventory" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-boxes mr-3"></i>Inventory
          </Link>
          <Link to="/admin/billing" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-dollar-sign mr-3"></i>Billing
          </Link>
          <Link to="/admin/insurance" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-shield-alt mr-3"></i>Insurance
          </Link>
          <Link to="/admin/analytics" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-chart-line mr-3"></i>Analytics
          </Link>
          <Link to="/admin/settings" className="block px-4 py-3 mb-2 text-white hover:bg-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-cog mr-3"></i>Settings
          </Link>
          <button onClick={logout} className="block w-full text-left px-4 py-3 mt-8 text-white hover:bg-red-900 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-sign-out-alt mr-3"></i>Logout
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;