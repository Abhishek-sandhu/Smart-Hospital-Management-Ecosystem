import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientLabReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/patient/lab-reports', config);
    setReports(res.data);
  };

  const downloadReport = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, responseType: 'blob' } };
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/lab-report/${id}/download`, config);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Download failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Lab Reports</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td className="border px-4 py-2">{report.testName}</td>
                <td className="border px-4 py-2">{new Date(report.testDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${report.status === 'completed' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => downloadReport(report._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientLabReports;