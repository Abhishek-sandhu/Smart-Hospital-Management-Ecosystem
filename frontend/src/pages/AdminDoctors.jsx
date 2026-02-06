import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPersonAdd, MdLocalHospital, MdSave, MdClose, MdPeople, MdPerson, MdEmail, MdLocalHospital as MdStethoscope, MdDateRange, MdAttachMoney, MdSettings, MdDelete } from 'react-icons/md';

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
    const res = await axios.get('http://localhost:5000/api/admin/users', config);
    setDoctors(res.data.filter(u => u.role === 'doctor'));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/admin/doctor', form, config);
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
      await axios.delete(`http://localhost:5000/api/admin/doctor/${id}`, config);
      fetchDoctors();
      alert('Doctor removed');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Management</h1>
          <p className="text-gray-600">Add, view, and manage healthcare professionals in the system</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <MdPersonAdd className="inline mr-2" />Add New Doctor
          </button>
        </div>

        {showAdd && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdLocalHospital className="text-white text-lg" />
                </div>
                Add New Doctor
              </h2>
            </div>
            <form onSubmit={addDoctor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter doctor's full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Years of experience"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ($)</label>
                  <input
                    name="consultationFee"
                    value={form.consultationFee}
                    onChange={handleChange}
                    placeholder="Consultation fee in dollars"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdSave className="inline mr-2" />Add Doctor
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdClose className="inline mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MdPeople className="text-white text-lg" />
              </div>
              Registered Doctors
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPerson className="inline mr-2" />Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdEmail className="inline mr-2" />Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdStethoscope className="inline mr-2" />Specialization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdDateRange className="inline mr-2" />Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdAttachMoney className="inline mr-2" />Consultation Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdSettings className="inline mr-2" />Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map(doctor => (
                    <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.experience} years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${doctor.consultationFee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => removeDoctor(doctor._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <MdDelete className="inline mr-1" />Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;