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
      await axios.post('http://localhost:5000/api/lab/report', formData, {
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Lab Report</h1>
      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input name="patient" value={form.patient} onChange={handleChange} placeholder="Patient ID" className="p-2 border rounded" required />
            <input name="testName" value={form.testName} onChange={handleChange} placeholder="Test Name" className="p-2 border rounded" required />
          </div>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} placeholder="Remarks" className="w-full p-2 border rounded mb-4"></textarea>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="critical" checked={form.critical} onChange={handleChange} className="mr-2" />
              Mark as Critical
            </label>
          </div>
          <div className="mb-4">
            <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png" className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload Report</button>
        </form>
      </div>
    </div>
  );
};

export default LabUploadReport;