import { useEffect, useState } from 'react';
import axios from 'axios';

const LabCriticalCases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/lab/critical-cases', config);
    setCases(res.data);
  };

  const downloadReport = (fileUrl) => {
    window.open(`http://localhost:5000/${fileUrl}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Critical Cases</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-red-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Remarks</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(case_ => (
              <tr key={case_._id}>
                <td className="border px-4 py-2">{case_.patient.name}</td>
                <td className="border px-4 py-2">{case_.testName}</td>
                <td className="border px-4 py-2">{case_.remarks}</td>
                <td className="border px-4 py-2">
                  {case_.fileUrl && <button onClick={() => downloadReport(case_.fileUrl)} className="bg-red-500 text-white px-2 py-1 rounded">Download</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabCriticalCases;