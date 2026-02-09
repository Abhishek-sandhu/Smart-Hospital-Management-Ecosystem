import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MdDashboard, MdLocalPharmacy, MdScience, MdLocalHospital, MdLogout, MdMenu } from 'react-icons/md';
import { FiUser, FiCalendar, FiCreditCard } from 'react-icons/fi';

const PatientLayout = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await axios.get('/api/auth/me', config);
        setUser(res.data);
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/patient', icon: <MdDashboard />, label: 'Dashboard' },
    { path: '/patient/profile', icon: <FiUser />, label: 'Profile' },
    { path: '/patient/appointments', icon: <FiCalendar />, label: 'Appointments' },
    { path: '/patient/prescriptions', icon: <MdLocalPharmacy />, label: 'Prescriptions' },
    { path: '/patient/lab-reports', icon: <MdScience />, label: 'Lab Reports' },
    { path: '/patient/billing', icon: <FiCreditCard />, label: 'Billing' },
    { path: '/patient/emergency', icon: <MdLocalHospital />, label: 'Emergency' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`hms-sidebar overflow-y-auto transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block fixed md:static h-full`}>
        <div className="hms-sidebar-header flex flex-col items-center justify-center py-6 bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 shadow-inner ring-2 ring-white/30">
            <FiUser className="text-3xl text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">Patient Portal</h2>
          {user && <p className="text-xs text-blue-100 mt-1 uppercase tracking-wider">{user.name}</p>}
        </div>

        <nav className="hms-sidebar-nav px-2 space-y-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`hms-sidebar-nav-item rounded-lg mx-2 ${location.pathname === item.path ? 'active bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'}`}
            >
              <span className={`text-xl mr-3 ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200 mx-4">
            <button onClick={logout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group">
              <MdLogout className="mr-3 text-xl group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-20">
          <div className="flex items-center">
            <MdLocalHospital className="text-2xl text-blue-600 mr-2" />
            <h1 className="font-bold text-gray-800">My Health</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
          >
            <MdMenu className="text-xl" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 scrollbar-thin">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLayout;
