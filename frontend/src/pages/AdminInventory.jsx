import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <button onClick={() => setShowAdd(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Medicine</button>
      {showAdd && (
        <form onSubmit={addMedicine} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-3 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="p-2 border rounded" required />
            <input name="minStock" value={form.minStock} onChange={handleChange} placeholder="Min Stock" type="number" className="p-2 border rounded" />
            <input name="expiryDate" value={form.expiryDate} onChange={handleChange} placeholder="Expiry Date" type="date" className="p-2 border rounded" />
            <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier" className="p-2 border rounded" />
            <input name="cost" value={form.cost} onChange={handleChange} placeholder="Cost" type="number" className="p-2 border rounded" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2 mt-4">Add</button>
          <button onClick={() => setShowAdd(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Min Stock</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(med => (
              <tr key={med._id}>
                <td className="border px-4 py-2">{med.name}</td>
                <td className="border px-4 py-2">{med.stock}</td>
                <td className="border px-4 py-2">{med.minStock}</td>
                <td className="border px-4 py-2">{med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded ${med.stock <= med.minStock ? 'bg-red-200' : 'bg-green-200'}`}>
                    {med.stock <= med.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => updateMedicine(med._id, { stock: prompt('New stock', med.stock) })} className="bg-blue-500 text-white px-2 py-1 rounded">Update Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;