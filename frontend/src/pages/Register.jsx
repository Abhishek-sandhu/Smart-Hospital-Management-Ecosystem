import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHospital, FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaUserMd, FaSpinner, FaSignInAlt, FaUserPlus, FaInfoCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    dateOfBirth: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role, phone, dateOfBirth, gender } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-rainbow bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-size-200">
      <div className="glass-effect p-8 rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in-up border border-white/20 relative overflow-hidden my-8">

        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-100px] right-[-50px] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-custom"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-4 shadow-glow">
            <FaUserPlus className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm font-display">Create Account</h2>
          <p className="text-blue-100">Join our medical community</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6 text-sm flex items-center shadow-lg">
            <FaInfoCircle className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-blue-200" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-blue-200" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-blue-200" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-blue-200" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  placeholder="+1 (234) 567-8900"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCalendar className="text-blue-200" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="group">
              <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="male" className="bg-gray-800 text-white">Male</option>
                  <option value="female" className="bg-gray-800 text-white">Female</option>
                  <option value="other" className="bg-gray-800 text-white">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role Selection - Full Width */}
          <div className="group">
            <label className="block text-sm font-semibold text-blue-100 mb-3 ml-1">I am a...</label>
            <div className="grid grid-cols-3 gap-4">
              {['patient', 'doctor', 'lab'].map((r) => (
                <label key={r} className={`cursor-pointer relative overflow-hidden rounded-xl border border-white/20 transition-all duration-300 ${role === r ? 'bg-white/20 shadow-glow ring-2 ring-white/50' : 'bg-white/5 hover:bg-white/10'}`}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="p-4 flex flex-col items-center justify-center text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform duration-300 ${role === r ? 'scale-110 bg-white text-purple-600' : 'bg-white/10 text-white'}`}>
                      {r === 'patient' && <FaUser />}
                      {r === 'doctor' && <FaUserMd />}
                      {r === 'lab' && <FaHospital />} {/* Changed FaSpinner to FaHospital for lab */}
                    </div>
                    <span className="capitalize font-medium text-white text-sm">{r}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaSignInAlt className="mr-2" />
                Register
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-blue-200 font-bold underline transition-colors duration-200 inline-flex items-center">
              <FaSignInAlt className="mr-1" /> Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
