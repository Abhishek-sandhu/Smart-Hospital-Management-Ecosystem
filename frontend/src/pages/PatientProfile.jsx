import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(res.data);
      setForm(res.data);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.put('http://localhost:5000/api/patient/profile', form, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const uploadPhoto = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    const formData = new FormData();
    formData.append('photo', photo);
    try {
      const res = await axios.post('http://localhost:5000/api/patient/profile/photo', formData, config);
      setUser(res.data);
      alert('Photo uploaded');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">Patient Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <img
                src={user.profilePhoto || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200 shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg">
                <i className="fas fa-camera text-white text-sm"></i>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
            <p className="text-gray-600 mb-6">{user.email}</p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-upload mr-2"></i>Choose Photo
                </label>
              </div>
              <button
                onClick={uploadPhoto}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-cloud-upload mr-2"></i>Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-user-edit mr-3 text-blue-500"></i>Personal Information
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-edit mr-2"></i>Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-user mr-2 text-blue-500"></i>Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-phone mr-2 text-green-500"></i>Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>Address
                    </label>
                    <input
                      name="address"
                      value={form.address || ''}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-tint mr-2 text-red-500"></i>Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={form.bloodGroup || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
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
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-shield-alt mr-2 text-purple-500"></i>Insurance ID
                    </label>
                    <input
                      name="insuranceId"
                      value={form.insuranceId || ''}
                      onChange={handleChange}
                      placeholder="Enter insurance ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <i className="fas fa-birthday-cake mr-2 text-pink-500"></i>Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={form.age || ''}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <i className="fas fa-save mr-2"></i>Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <i className="fas fa-times mr-2"></i>Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center">
                      <i className="fas fa-user text-blue-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold text-gray-800">{user.name || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-green-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-800">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center">
                      <i className="fas fa-phone text-purple-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-red-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold text-gray-800">{user.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center">
                      <i className="fas fa-birthday-cake text-yellow-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold text-gray-800">{user.age || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg border-l-4 border-pink-500">
                    <div className="flex items-center">
                      <i className="fas fa-tint text-pink-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Blood Group</p>
                        <p className="font-semibold text-gray-800">{user.bloodGroup || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border-l-4 border-indigo-500 md:col-span-2">
                    <div className="flex items-center">
                      <i className="fas fa-shield-alt text-indigo-500 text-xl mr-3"></i>
                      <div>
                        <p className="text-sm text-gray-600">Insurance ID</p>
                        <p className="font-semibold text-gray-800">{user.insuranceId || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
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