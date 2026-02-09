import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPersonAdd, MdLocalHospital, MdSave, MdClose, MdPeople, MdPerson, MdEmail, MdDateRange, MdAttachMoney, MdSettings, MdDelete } from 'react-icons/md';
import { FaStethoscope } from 'react-icons/fa';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '', consultationFee: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/admin/users', config);
    setDoctors(res.data.filter(u => u.role === 'doctor'));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('/api/admin/doctor', form, config);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', specialization: '', experience: '', consultationFee: '' });
      fetchDoctors();
      alert('Doctor added');
    } catch (err) {
      alert('Failed');
    }
  };

  const removeDoctor = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`/api/admin/doctor/${id}`, config);
      fetchDoctors();
      alert('Doctor removed');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary">Doctor Management</h1>
          <p className="hms-body-text text-gray-600">Add, view, and manage healthcare professionals in the system</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAdd(true)}
            className="hms-btn hms-btn-primary"
          >
            <MdPersonAdd className="inline mr-2" />Add New Doctor
          </button>
        </div>

        {showAdd && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="hms-heading-secondary flex items-center mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <MdLocalHospital className="text-white text-xl" />
                </div>
                Add New Doctor
              </h2>
            </div>
            <form onSubmit={addDoctor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter doctor's full name"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    type="email"
                    className="hms-form-input"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    type="password"
                    className="hms-form-input"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Specialization</label>
                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Years of Experience</label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Years of experience"
                    type="number"
                    min="0"
                    className="hms-form-input"
                    required
                  />
                </div>
                <div className="hms-form-group mb-0">
                  <label className="hms-form-label">Consultation Fee ($)</label>
                  <input
                    name="consultationFee"
                    value={form.consultationFee}
                    onChange={handleChange}
                    placeholder="Consultation fee in dollars"
                    type="number"
                    min="0"
                    step="0.01"
                    className="hms-form-input"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="hms-btn hms-btn-secondary"
                >
                  <MdSave className="inline mr-2" />Add Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="hms-btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <MdClose className="inline mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="hms-heading-secondary flex items-center mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <MdPeople className="text-white text-xl" />
              </div>
              Registered Doctors
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center"><MdPerson className="mr-2" />Name</div>
                    </th>
                    <th>
                      <div className="flex items-center"><MdEmail className="mr-2" />Email</div>
                    </th>
                    <th>
                      <div className="flex items-center"><FaStethoscope className="mr-2" />Specialization</div>
                    </th>
                    <th>
                      <div className="flex items-center"><MdDateRange className="mr-2" />Experience</div>
                    </th>
                    <th>
                      <div className="flex items-center"><MdAttachMoney className="mr-2" />Consultation Fee</div>
                    </th>
                    <th>
                      <div className="flex items-center"><MdSettings className="mr-2" />Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doctor => (
                    <tr key={doctor._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="font-medium text-gray-900">{doctor.name}</td>
                      <td className="text-gray-600">{doctor.email}</td>
                      <td className="text-gray-600">{doctor.specialization}</td>
                      <td className="text-gray-600">{doctor.experience} years</td>
                      <td className="font-bold text-green-600">${doctor.consultationFee}</td>
                      <td>
                        <button
                          onClick={() => removeDoctor(doctor._id)}
                          className="hms-btn hms-btn-primary bg-red-600 hover:bg-red-700 from-red-500 to-red-600 border-none px-3 py-1 text-xs"
                          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
                        >
                          <MdDelete className="inline mr-1" />Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {doctors.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdPeople className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-500">No doctors registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
