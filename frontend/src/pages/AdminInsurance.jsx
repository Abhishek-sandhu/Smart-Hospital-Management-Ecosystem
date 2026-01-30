import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminInsurance = () => {
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/insurances', config);
    setInsurances(res.data);
  };

  const approveInsurance = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/insurance/${id}/approve`, {}, config);
      fetchInsurances();
      alert('Insurance approved');
    } catch (err) {
      alert('Failed');
    }
  };

  const rejectInsurance = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/insurance/${id}/reject`, {}, config);
      fetchInsurances();
      alert('Insurance rejected');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Insurance Management</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Policy Number</th>
              <th className="px-4 py-2">Coverage</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insurances.map(ins => (
              <tr key={ins._id}>
                <td className="border px-4 py-2">{ins.patient.name}</td>
                <td className="border px-4 py-2">{ins.provider}</td>
                <td className="border px-4 py-2">{ins.policyNumber}</td>
                <td className="border px-4 py-2">${ins.coverageAmount}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${ins.status === 'approved' ? 'bg-green-200' : ins.status === 'rejected' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                    {ins.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {ins.status === 'pending' && (
                    <>
                      <button onClick={() => approveInsurance(ins._id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
                      <button onClick={() => rejectInsurance(ins._id)} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInsurance;