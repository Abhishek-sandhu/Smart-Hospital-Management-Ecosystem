import { useState } from 'react';
import axios from 'axios';

const LabUploadReport = () => {
  const [form, setForm] = useState({ patient: '', testName: '', remarks: '', critical: false });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('patient', form.patient);
    formData.append('testName', form.testName);
    formData.append('remarks', form.remarks);
    formData.append('critical', form.critical);
    if (file) formData.append('file', file);

    try {
      await axios.post('/api/lab/report', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Report uploaded');
      setForm({ patient: '', testName: '', remarks: '', critical: false });
      setFile(null);
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Lab Report</h1>
          <p className="text-gray-600">Upload and submit laboratory test results and reports</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-upload text-white"></i>
              </div>
              Report Upload Form
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    name="patient"
                    value={form.patient}
                    onChange={handleChange}
                    placeholder="Enter patient ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                  <input
                    name="testName"
                    value={form.testName}
                    onChange={handleChange}
                    placeholder="e.g., Blood Test, X-Ray, MRI"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Enter test results, observations, or additional notes"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  name="critical"
                  checked={form.critical}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    Mark as Critical - Requires immediate medical attention
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.png,.doc,.docx"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG, DOC, DOCX up to 10MB
                    </p>
                    {file && (
                      <p className="text-sm text-green-600 font-medium">
                        <i className="fas fa-check-circle mr-1"></i>
                        {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <i className="fas fa-upload mr-2"></i>Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabUploadReport;
