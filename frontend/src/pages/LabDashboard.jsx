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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lab Dashboard</h1>
            <p className="text-gray-600">Manage laboratory tests and generate reports</p>
          </div>
          {user && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-id-card text-white"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lab Staff ID</p>
                  <p className="text-lg font-bold font-mono text-gray-900">{user.uniqueId || 'LAB001'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-flask text-white text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests Today</p>
                <p className="text-2xl font-bold text-gray-900">15</p> {/* Placeholder */}
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-file-medical text-white text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900">12</p> {/* Placeholder */}
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Cases</p>
                <p className="text-2xl font-bold text-gray-900">2</p> {/* Placeholder */}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-upload text-white"></i>
            </div>
            Upload Lab Report
          </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <i className="fas fa-id-card mr-2 text-blue-600"></i>Patient ID
              </label>
              <input
                name="patient"
                placeholder="Enter Patient ID"
                value={form.patient}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <i className="fas fa-flask mr-2 text-purple-600"></i>Test Name
              </label>
              <input
                name="testName"
                placeholder="e.g., Blood Test, X-Ray"
                value={form.testName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <i className="fas fa-calendar mr-2 text-green-600"></i>Test Date
            </label>
            <input
              name="testDate"
              type="date"
              value={form.testDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <i className="fas fa-file-medical mr-2 text-red-600"></i>Test Results
            </label>
            <textarea
              name="results"
              placeholder="Enter detailed test results..."
              value={form.results}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <i className="fas fa-cloud-upload-alt mr-2 text-indigo-600"></i>Upload Report File (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              <i className="fas fa-upload mr-2"></i>Upload Report
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LabDashboard;