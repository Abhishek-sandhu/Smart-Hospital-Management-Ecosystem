import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPeople, MdPerson, MdEmail, MdPersonOutline, MdInfo, MdSettings, MdOutlineAdminPanelSettings, MdLocalHospital, MdScience, MdBlock, MdCheckCircle, MdLockOpen } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user roles and permissions across the hospital system</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <MdPeople className="text-white text-lg" />
              </div>
              All Users
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPerson className="inline mr-2" />Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdEmail className="inline mr-2" />Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPersonOutline className="inline mr-2" />Role
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
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                          user.role === 'lab' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? <MdOutlineAdminPanelSettings className="mr-1" /> :
                           user.role === 'doctor' ? <MdLocalHospital className="mr-1" /> :
                           user.role === 'lab' ? <MdScience className="mr-1" /> :
                           <MdPerson className="mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'patient' && (
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBlocked ? <MdBlock className="mr-1" /> : <MdCheckCircle className="mr-1" />}
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.role === 'patient' && (
                          <>
                            {user.isBlocked ? (
                              <button
                                onClick={() => unblockPatient(user._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                              >
                                <MdLockOpen className="inline mr-1" />Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => blockPatient(user._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                              >
                                <MdBlock className="inline mr-1" />Block
                              </button>
                            )}
                          </>
                        )}
                        <select
                          onChange={(e) => assignRole(user._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
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
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;