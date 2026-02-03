import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdAdd, MdLocalPharmacy, MdSave, MdClose, MdWarehouse, MdInventory, MdWarning, MdEventBusy, MdInfo, MdSettings, MdEdit, MdCheckCircle } from 'react-icons/md';

const AdminInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', stock: '', minStock: '', expiryDate: '', supplier: '', cost: '', price: '', location: '' });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/medicines', config);
    setMedicines(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addMedicine = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/api/admin/medicine', form, config);
      setShowAdd(false);
      setForm({ name: '', category: '', stock: '', minStock: '', expiryDate: '', supplier: '', cost: '', price: '', location: '' });
      fetchMedicines();
      alert('Medicine added');
    } catch (err) {
      alert('Failed');
    }
  };

  const updateMedicine = async (id, updates) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/medicine/${id}`, updates, config);
      fetchMedicines();
      alert('Medicine updated');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage medicine stock, track inventory levels, and monitor expiry dates</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <MdAdd className="inline mr-2" />Add New Medicine
          </button>
        </div>

        {showAdd && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdLocalPharmacy className="text-white text-lg" />
                </div>
                Add New Medicine
              </h2>
            </div>
            <form onSubmit={addMedicine} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter medicine name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g., Antibiotics, Pain Relief"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Units in stock"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level</label>
                  <input
                    name="minStock"
                    value={form.minStock}
                    onChange={handleChange}
                    placeholder="Reorder point"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <input
                    name="supplier"
                    value={form.supplier}
                    onChange={handleChange}
                    placeholder="Supplier name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price ($)</label>
                  <input
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="Purchase cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Selling price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., Shelf A-1, Cabinet 3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdSave className="inline mr-2" />Add Medicine
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
                >
                  <MdClose className="inline mr-2" />Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <MdWarehouse className="text-white text-lg" />
              </div>
              Medicine Inventory
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdLocalPharmacy className="inline mr-2" />Medicine Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdInventory className="inline mr-2" />Current Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdWarning className="inline mr-2" />Min Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdEventBusy className="inline mr-2" />Expiry Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdInfo className="inline mr-2" />Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdSettings className="inline mr-2" />Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {medicines.map(med => (
                    <tr key={med._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.stock} units</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.minStock || 0} units</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          med.stock <= (med.minStock || 0)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {med.stock <= (med.minStock || 0) ? <MdWarning className="mr-1" /> : <MdCheckCircle className="mr-1" />}
                          {med.stock <= (med.minStock || 0) ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => updateMedicine(med._id, { stock: prompt('New stock quantity', med.stock) })}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <MdEdit className="inline mr-1" />Update Stock
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

export default AdminInventory;