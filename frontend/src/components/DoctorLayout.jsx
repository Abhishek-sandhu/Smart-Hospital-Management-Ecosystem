import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';

const DoctorLayout = () => {
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
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-800 shadow-2xl">
        <div className="p-6 border-b border-green-500">
          <h2 className="text-2xl font-bold text-white mb-2">Doctor Portal</h2>
          {user && <p className="text-sm text-green-200">Dr. {user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/doctor" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
          </Link>
          <Link to="/doctor/profile" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-user-md mr-3"></i>Profile
          </Link>
          <Link to="/doctor/appointments" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-calendar-check mr-3"></i>Appointments
          </Link>
          <Link to="/doctor/patients" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-users mr-3"></i>Patients
          </Link>
          <Link to="/doctor/prescriptions" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-prescription mr-3"></i>Prescriptions
          </Link>
          <Link to="/doctor/lab-reports" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-microscope mr-3"></i>Lab Reports
          </Link>
          <Link to="/doctor/emergency" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-exclamation-triangle mr-3"></i>Emergency
          </Link>
          <Link to="/doctor/analytics" className="block px-4 py-3 mb-2 text-white hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-chart-line mr-3"></i>Analytics
          </Link>
          <button onClick={logout} className="block w-full text-left px-4 py-3 mt-8 text-white hover:bg-red-600 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
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

export default DoctorLayout;