import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHospital, FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaInfoCircle, FaUserPlus } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-rainbow bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-size-200">
      <div className="glass-effect p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up border border-white/20 relative overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Header */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-4 shadow-glow animate-bounce-in">
            <FaHospital className="text-white text-3xl drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm font-display tracking-tight">Welcome Back</h2>
          <p className="text-blue-100 font-medium">Smart Hospital Ecosystem</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6 text-sm flex items-center animate-slide-in-left">
            <FaInfoCircle className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 shadow-inner"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-blue-200 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 shadow-inner"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaSignInAlt className="mr-2" />
                Sign In
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-white hover:text-blue-200 font-bold underline transition-colors duration-200 flex items-center justify-center gap-1 inline-flex mt-2">
              <FaUserPlus /> Create Account
            </Link>
          </p>
        </div>


      </div>
    </div>
  );
};

export default Login;
