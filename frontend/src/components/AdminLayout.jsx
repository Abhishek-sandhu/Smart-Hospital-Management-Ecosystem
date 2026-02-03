import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdLocalHospital, MdScience, MdInventory, MdSecurity } from 'react-icons/md';
import { FiUsers, FiDollarSign, FiBarChart, FiSettings, FiLogOut } from 'react-icons/fi';

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
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
          {user && <p className="text-sm text-gray-600">{user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/admin" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdDashboard className="mr-3" />Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiUsers className="mr-3" />Users
          </Link>
          <Link to="/admin/doctors" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdLocalHospital className="mr-3" />Doctors
          </Link>
          <Link to="/admin/lab-staff" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdScience className="mr-3" />Lab Staff
          </Link>
          <Link to="/admin/inventory" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdInventory className="mr-3" />Inventory
          </Link>
          <Link to="/admin/billing" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiDollarSign className="mr-3" />Billing
          </Link>
          <Link to="/admin/insurance" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdSecurity className="mr-3" />Insurance
          </Link>
          <Link to="/admin/analytics" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBarChart className="mr-3" />Analytics
          </Link>
          <Link to="/admin/settings" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSettings className="mr-3" />Settings
          </Link>
          <button onClick={logout} className="flex items-center w-full text-left px-4 py-3 mt-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FiLogOut className="mr-3" />Logout
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