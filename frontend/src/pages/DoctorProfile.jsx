import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaStethoscope, FaCalendarAlt, FaDollarSign, FaEdit } from 'react-icons/fa';

const DoctorProfile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/doctor/profile', config);
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

    // Only send allowed fields
    const updateData = {
      name: form.name,
      phone: form.phone,
      specialization: form.specialization,
      experience: form.experience,
      consultationFee: form.consultationFee
    };

    try {
      const res = await axios.put('/api/doctor/profile', updateData, config);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary">Doctor Profile</h1>
          <p className="hms-body-text text-gray-600">Manage your professional information and settings</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <FaUserMd className="text-white text-xl" />
              </div>
              Professional Information
            </h2>
          </div>

          <div className="p-8">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">Full Name</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="hms-form-input"
                      required
                    />
                  </div>
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">Phone Number</label>
                    <input
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="hms-form-input"
                    />
                  </div>
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">Specialization</label>
                    <input
                      name="specialization"
                      value={form.specialization || ''}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, Pediatrics"
                      className="hms-form-input"
                    />
                  </div>
                  <div className="hms-form-group mb-0">
                    <label className="hms-form-label">Years of Experience</label>
                    <input
                      name="experience"
                      type="number"
                      value={form.experience || ''}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      className="hms-form-input"
                      min="0"
                    />
                  </div>
                  <div className="hms-form-group mb-0 md:col-span-2">
                    <label className="hms-form-label">Consultation Fee ($)</label>
                    <input
                      name="consultationFee"
                      type="number"
                      value={form.consultationFee || ''}
                      onChange={handleChange}
                      placeholder="Consultation fee in dollars"
                      className="hms-form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="hms-btn hms-btn-secondary"
                  >
                    <FaSave className="mr-2" />Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <FaTimes className="mr-2" />Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaUser className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Full Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaEnvelope className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Email Address</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaPhone className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Phone Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaStethoscope className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Specialization</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.specialization || 'Not specified'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Years of Experience</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.experience ? `${user.experience} years` : 'Not specified'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FaDollarSign className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Consultation Fee</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.consultationFee ? `$${user.consultationFee}` : 'Not specified'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setEditing(true)}
                    className="hms-btn hms-btn-primary"
                  >
                    <FaEdit className="mr-2" />Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
