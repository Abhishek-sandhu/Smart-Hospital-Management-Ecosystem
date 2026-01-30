import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/admin/users', config);
    setUsers(res.data);
  };

  const assignRole = async (id, role) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/user/${id}/role`, { role }, config);
      fetchUsers();
      alert('Role assigned');
    } catch (err) {
      alert('Failed');
    }
  };

  const blockPatient = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/patient/${id}/block`, {}, config);
      fetchUsers();
      alert('Patient blocked');
    } catch (err) {
      alert('Failed');
    }
  };

  const unblockPatient = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/admin/patient/${id}/unblock`, {}, config);
      fetchUsers();
      alert('Patient unblocked');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  {user.role === 'patient' && (
                    <span className={`px-2 py-1 rounded ${user.isBlocked ? 'bg-red-200' : 'bg-green-200'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {user.role === 'patient' && (
                    <>
                      {user.isBlocked ? (
                        <button onClick={() => unblockPatient(user._id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Unblock</button>
                      ) : (
                        <button onClick={() => blockPatient(user._id)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Block</button>
                      )}
                    </>
                  )}
                  <select onChange={(e) => assignRole(user._id, e.target.value)} className="p-1 border rounded">
                    <option value="">Change Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="lab">Lab</option>
                    <option value="admin">Admin</option>
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

export default AdminUsers;