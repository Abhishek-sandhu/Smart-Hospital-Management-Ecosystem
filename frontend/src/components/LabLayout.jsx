import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';

const LabLayout = () => {
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
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 shadow-2xl">
        <div className="p-6 border-b border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-2">Lab Portal</h2>
          {user && <p className="text-sm text-purple-200">{user.name}</p>}
        </div>
        <nav className="mt-8 px-4">
          <Link to="/lab" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-tachometer-alt mr-3"></i>Dashboard
          </Link>
          <Link to="/lab/profile" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-user mr-3"></i>Profile
          </Link>
          <Link to="/lab/tests" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-flask mr-3"></i>Tests
          </Link>
          <Link to="/lab/upload-report" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-upload mr-3"></i>Upload Report
          </Link>
          <Link to="/lab/reports" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-file-medical mr-3"></i>Reports History
          </Link>
          <Link to="/lab/critical-cases" className="block px-4 py-3 mb-2 text-white hover:bg-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <i className="fas fa-exclamation-triangle mr-3"></i>Critical Cases
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

export default LabLayout;