import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorLabReports = () => {
  const [reports, setReports] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({ patient: '', testName: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/doctor/lab-reports', config);
    setReports(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const requestTest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/doctor/lab-test', form, config);
      setShowRequest(false);
      setForm({ patient: '', testName: '' });
      fetchReports();
      alert('Test requested');
    } catch (err) {
      alert('Request failed');
    }
  };

  const markCritical = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/doctor/lab-report/${id}/critical`, {}, config);
      fetchReports();
      alert('Marked as critical');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lab Reports</h1>
      <button onClick={() => setShowRequest(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Request Lab Test</button>
      {showRequest && (
        <form onSubmit={requestTest} className="bg-white p-6 rounded shadow mb-6">
          <input name="patient" value={form.patient} onChange={handleChange} placeholder="Patient ID" className="block w-full mb-4 p-2 border rounded" />
          <input name="testName" value={form.testName} onChange={handleChange} placeholder="Test Name" className="block w-full mb-4 p-2 border rounded" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Request</button>
          <button onClick={() => setShowRequest(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td className="border px-4 py-2">{report.patient.name}</td>
                <td className="border px-4 py-2">{report.testName}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${report.status === 'completed' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                    {report.status}
                  </span>
                  {report.critical && <span className="ml-2 px-2 py-1 bg-red-200 rounded">Critical</span>}
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => markCritical(report._id)} className="bg-red-500 text-white px-2 py-1 rounded">Mark Critical</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorLabReports;