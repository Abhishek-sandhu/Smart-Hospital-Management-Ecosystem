import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdLocalPharmacy, MdScience, MdLocalHospital } from 'react-icons/md';
import { FiUser, FiCalendar, FiCreditCard, FiLogOut } from 'react-icons/fi';

const PatientLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/auth/me', config); // Assume we add this endpoint
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Portal</h2>
          {user && <p className="text-sm text-gray-600">{user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/patient" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdDashboard className="mr-3" />Dashboard
          </Link>
          <Link to="/patient/profile" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiUser className="mr-3" />Profile
          </Link>
          <Link to="/patient/appointments" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiCalendar className="mr-3" />Appointments
          </Link>
          <Link to="/patient/prescriptions" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdLocalPharmacy className="mr-3" />Prescriptions
          </Link>
          <Link to="/patient/lab-reports" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdScience className="mr-3" />Lab Reports
          </Link>
          <Link to="/patient/billing" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiCreditCard className="mr-3" />Billing
          </Link>
          <Link to="/patient/emergency" className="flex items-center px-4 py-3 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MdLocalHospital className="mr-3" />Emergency
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

export default PatientLayout;