import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Billing Management</h1>
      <button onClick={() => setShowGenerate(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Generate Bill</button>
      {showGenerate && (
        <form onSubmit={generateBill} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input name="patient" value={form.patient} onChange={handleChange} placeholder="Patient ID" className="p-2 border rounded" required />
            <input name="totalAmount" value={form.totalAmount} onChange={handleChange} placeholder="Total Amount" type="number" className="p-2 border rounded" required />
            <input name="dueDate" value={form.dueDate} onChange={handleChange} placeholder="Due Date" type="date" className="p-2 border rounded" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Items</h3>
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 mb-2">
              <input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Description" className="p-2 border rounded" />
              <input value={item.amount} onChange={(e) => handleItemChange(index, 'amount', e.target.value)} placeholder="Amount" type="number" className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={addItem} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Add Item</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Generate</button>
          <button onClick={() => setShowGenerate(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill._id}>
                <td className="border px-4 py-2">{bill.patient.name}</td>
                <td className="border px-4 py-2">${bill.totalAmount}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${bill.status === 'paid' ? 'bg-green-200' : bill.status === 'overdue' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                    {bill.status}
                  </span>
                </td>
                <td className="border px-4 py-2">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td className="border px-4 py-2">
                  <select onChange={(e) => updateStatus(bill._id, e.target.value)} className="p-1 border rounded">
                    <option value="">Change Status</option>
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
  );
};

export default AdminBilling;