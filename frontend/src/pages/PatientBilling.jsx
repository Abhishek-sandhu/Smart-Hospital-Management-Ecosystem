import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientBilling = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/patient/bills', config);
    setBills(res.data);
  };

  const downloadBill = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, responseType: 'blob' } };
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/bill/${id}/download`, config);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Download failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bills</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill._id}>
                <td className="border px-4 py-2">{bill.description}</td>
                <td className="border px-4 py-2">${bill.amount}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${bill.status === 'paid' ? 'bg-green-200' : bill.status === 'unpaid' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                    {bill.status}
                  </span>
                </td>
                <td className="border px-4 py-2">{new Date(bill.dueDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => downloadBill(bill._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Download Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientBilling;