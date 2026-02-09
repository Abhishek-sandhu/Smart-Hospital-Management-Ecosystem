import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaIdCard, FaFlask, FaFileMedical, FaExclamationTriangle, FaCloudUploadAlt, FaVial, FaFilePrescription, FaUser, FaClipboardList, FaCalendarAlt, FaFileUpload } from 'react-icons/fa';

const LabDashboard = () => {
  const [form, setForm] = useState({ patient: '', testName: '', testDate: '', results: '' });
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userRes = await axios.get('/api/auth/me', config);
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
      await axios.post('/api/lab/report', formData, config);
      alert('Report uploaded');
      setForm({ patient: '', testName: '', testDate: '', results: '' });
      setFile(null);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="hms-heading-primary text-3xl">Lab Dashboard</h1>
          <p className="hms-body-text text-gray-600">Manage laboratory tests and generate reports</p>
        </div>
        {user && (
          <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/20">
              <FaIdCard className="text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Lab Staff ID</p>
              <p className="font-mono text-gray-900 font-bold">{user.uniqueId || 'LAB001'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <FaFlask />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tests Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">15</p> {/* Placeholder */}
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <FaFileMedical />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Reports Generated</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">12</p> {/* Placeholder */}
            </div>
          </div>
        </div>

        <div className="hms-stat-card group">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <FaExclamationTriangle />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Critical Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">2</p> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8">
        <h2 className="hms-heading-secondary flex items-center mb-6 border-b border-gray-100 pb-4">
          <FaCloudUploadAlt className="text-purple-600 mr-3" />
          Upload Lab Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="hms-form-group mb-0">
                <label className="hms-form-label">Patient ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    name="patient"
                    placeholder="Enter Patient ID"
                    value={form.patient}
                    onChange={handleChange}
                    className="hms-form-input pl-10"
                    required
                  />
                </div>
              </div>
              <div className="hms-form-group mb-0">
                <label className="hms-form-label">Test Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaVial className="text-gray-400" />
                  </div>
                  <input
                    name="testName"
                    placeholder="e.g., Blood Test, X-Ray"
                    value={form.testName}
                    onChange={handleChange}
                    className="hms-form-input pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="hms-form-group mb-0">
                <label className="hms-form-label">Test Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    name="testDate"
                    type="date"
                    value={form.testDate}
                    onChange={handleChange}
                    className="hms-form-input pl-10"
                    required
                  />
                </div>
              </div>
              <div className="hms-form-group mb-0">
                <label className="hms-form-label">Upload Report File (Optional)</label>
                <div className="flex justify-center px-6 pt-3 pb-4 border-2 border-gray-200 border-dashed rounded-xl hover:border-purple-400 transition-colors bg-gray-50 hover:bg-white cursor-pointer group h-[52px]">
                  <div className="space-y-1 text-center flex items-center justify-center w-full h-full">
                    <FaCloudUploadAlt className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors mr-2" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hms-form-group mb-0">
            <label className="hms-form-label">Test Results</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FaClipboardList className="text-gray-400" />
              </div>
              <textarea
                name="results"
                placeholder="Enter detailed test results..."
                value={form.results}
                onChange={handleChange}
                rows="4"
                className="hms-form-textarea pl-10"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="hms-btn hms-btn-primary bg-purple-600 hover:bg-purple-700 from-purple-500 to-purple-700 px-8 flex items-center"
            >
              <FaCloudUploadAlt className="mr-2" /> Upload Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabDashboard;
