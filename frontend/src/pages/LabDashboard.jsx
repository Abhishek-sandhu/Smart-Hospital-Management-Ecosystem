import { useState, useEffect } from 'react';
import axios from 'axios';

const LabDashboard = () => {
  const [form, setForm] = useState({ patient: '', testName: '', testDate: '', results: '' });
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userRes = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(userRes.data);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/api/lab/report', formData, config);
      alert('Report uploaded');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Lab Dashboard</h1>
        {user && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center">
              <i className="fas fa-id-card mr-3"></i>
              <div>
                <p className="text-sm opacity-80">Lab Staff ID</p>
                <p className="text-lg font-bold font-mono">{user.uniqueId || 'LAB001'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-flask text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Tests Today</p>
              <p className="text-2xl font-bold">15</p> {/* Placeholder */}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-file-medical text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Reports Generated</p>
              <p className="text-2xl font-bold">12</p> {/* Placeholder */}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-3xl mr-4"></i>
            <div>
              <p className="text-sm opacity-80">Critical Cases</p>
              <p className="text-2xl font-bold">2</p> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <i className="fas fa-upload mr-3 text-purple-500"></i>Upload Lab Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
              <input
                name="patient"
                placeholder="Enter Patient ID"
                value={form.patient}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                name="testName"
                placeholder="e.g., Blood Test, X-Ray"
                value={form.testName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
            <input
              name="testDate"
              type="date"
              value={form.testDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Results</label>
            <textarea
              name="results"
              placeholder="Enter detailed test results..."
              value={form.results}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Report File (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors duration-200">
              <div className="space-y-1 text-center">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-upload mr-2"></i>Upload Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabDashboard;