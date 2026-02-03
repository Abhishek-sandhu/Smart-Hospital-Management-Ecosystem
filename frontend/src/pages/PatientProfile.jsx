import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPerson, MdPhotoCamera, MdEdit, MdClose, MdPerson as MdUser, MdEmail, MdPhone, MdLocationOn, MdCake, MdBloodtype, MdSecurity, MdSave } from 'react-icons/md';

const PatientProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/auth/me', config);
    setUser(res.data);
    setForm(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put('http://localhost:5000/api/patient/profile', form, config);
      setEditing(false);
      fetchUser();
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <div className="w-32 h-32 rounded-full mx-auto border-4 border-blue-600 shadow-sm relative overflow-hidden">
                <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                  <MdPerson className="text-4xl text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-3 shadow-sm">
                  <MdPhotoCamera className="text-white text-sm" />
                </div>
              </div>
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <MdEdit className="inline mr-2" />Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                      >
                        <MdClose className="inline mr-2" />Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {editing ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdUser className="inline mr-2 text-blue-600" />Full Name
                      </label>
                      <input
                        name="name"
                        value={form.name || ''}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdPhone className="inline mr-2 text-green-600" />Phone Number
                      </label>
                      <input
                        name="phone"
                        value={form.phone || ''}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdLocationOn className="inline mr-2 text-red-600" />Address
                      </label>
                      <input
                        name="address"
                        value={form.address || ''}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdCake className="inline mr-2 text-yellow-600" />Age
                      </label>
                      <input
                        name="age"
                        type="number"
                        value={form.age || ''}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdBloodtype className="inline mr-2 text-red-600" />Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={form.bloodGroup || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        <MdSecurity className="inline mr-2 text-indigo-600" />Insurance ID
                      </label>
                      <input
                        name="insuranceId"
                        value={form.insuranceId || ''}
                        onChange={handleChange}
                        placeholder="Enter insurance ID"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <MdSave className="inline mr-2" />Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <MdClose className="inline mr-2" />Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdUser className="text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Full Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdEmail className="text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Email</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdPhone className="text-indigo-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Phone</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdLocationOn className="text-red-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Address</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.address || 'Not provided'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdCake className="text-yellow-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Age</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.age || 'Not provided'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <MdBloodtype className="text-red-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-600">Blood Group</span>
                    </div>
                    <p className="text-gray-900 font-medium">{user.bloodGroup || 'Not provided'}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Completion</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-gray-600">85% Complete</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;