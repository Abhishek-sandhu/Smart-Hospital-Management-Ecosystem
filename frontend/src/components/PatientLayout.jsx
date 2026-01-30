import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';

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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl">
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-2xl font-bold text-white mb-2">Patient Portal</h2>
          {user && <p className="text-sm text-blue-200">{user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/patient" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
          </Link>
          <Link to="/patient/profile" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-user mr-3"></i>Profile
          </Link>
          <Link to="/patient/appointments" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-calendar mr-3"></i>Appointments
          </Link>
          <Link to="/patient/prescriptions" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-pills mr-3"></i>Prescriptions
          </Link>
          <Link to="/patient/lab-reports" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-flask mr-3"></i>Lab Reports
          </Link>
          <Link to="/patient/billing" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-credit-card mr-3"></i>Billing
          </Link>
          <Link to="/patient/emergency" className="block px-4 py-3 mb-2 text-white hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-ambulance mr-3"></i>Emergency
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

export default PatientLayout;