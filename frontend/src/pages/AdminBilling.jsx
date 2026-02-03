import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPlus, FiSave, FiX, FiUser, FiDollarSign, FiInfo, FiCalendar, FiSettings } from 'react-icons/fi';
import { MdReceipt } from 'react-icons/md';

const AdminBilling = () => {
  const [bills, setBills] = useState([]);
  const [showGenerate, setShowGenerate] = useState(false);
  const [form, setForm] = useState({ patient: '', items: [{ description: '', amount: '' }], totalAmount: '', dueDate: '' });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/bills', config);
    setBills(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', amount: '' }] });

  const generateBill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/admin/bill', form, config);
      setShowGenerate(false);
      setForm({ patient: '', items: [{ description: '', amount: '' }], totalAmount: '', dueDate: '' });
      fetchBills();
      alert('Bill generated');
    } catch (err) {
      alert('Failed');
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/bill/${id}/status`, { status }, config);
      fetchBills();
      alert('Status updated');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing Management</h1>
          <p className="text-gray-600">Generate and manage patient billing records and payment status</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowGenerate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <FiPlus className="mr-2" />Generate New Bill
          </button>
        </div>

        {showGenerate && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdReceipt className="text-white" />
                </div>
                Generate Bill
              </h2>
            </div>
            <form onSubmit={generateBill} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    name="patient"
                    value={form.patient}
                    onChange={handleChange}
                    placeholder="Enter patient ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount ($)</label>
                  <input
                    name="totalAmount"
                    value={form.totalAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Bill Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  >
                    <FiPlus className="mr-2" />Add Item
                  </button>
                </div>
                <div className="space-y-4">
                  {form.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Service or item description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                          <input
                            value={item.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <FiSave className="mr-2" />Generate Bill
                </button>
                <button
                  onClick={() => setShowGenerate(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <FiX className="mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MdReceipt className="text-white" />
              </div>
              Billing Records
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <FiUser className="mr-2" />Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <FiDollarSign className="mr-2" />Total Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <FiInfo className="mr-2" />Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <FiCalendar className="mr-2" />Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <FiSettings className="mr-2" />Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bills.map(bill => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${bill.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          bill.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : bill.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <i className={`fas mr-1 ${
                            bill.status === 'paid' ? 'fa-check-circle' :
                            bill.status === 'overdue' ? 'fa-exclamation-triangle' :
                            'fa-clock'
                          }`}></i>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          onChange={(e) => updateStatus(bill._id, e.target.value)}
                          defaultValue=""
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="" disabled>Change Status</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
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

export default AdminBilling;