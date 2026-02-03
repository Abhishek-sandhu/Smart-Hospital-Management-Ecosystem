import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdReceipt, MdDateRange, MdAttachMoney, MdDownload, MdCheckCircle, MdSchedule, MdPayment, MdCancel } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bills</h1>
          <p className="text-gray-600">View and download your billing statements</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MdReceipt className="text-white" />
              </div>
              Billing History
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPayment className="inline mr-2" />Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdAttachMoney className="inline mr-2" />Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdCheckCircle className="inline mr-2" />Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdDateRange className="inline mr-2" />Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdDownload className="inline mr-2" />Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bills.map(bill => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${bill.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          bill.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : bill.status === 'unpaid'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bill.status === 'paid' ? <MdCheckCircle className="mr-1" /> :
                           bill.status === 'unpaid' ? <MdCancel className="mr-1" /> : <MdSchedule className="mr-1" />}
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => downloadBill(bill._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <MdDownload className="inline mr-2" />Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBilling;