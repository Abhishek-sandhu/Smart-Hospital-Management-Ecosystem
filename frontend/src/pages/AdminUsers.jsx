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
    const res = await axios.get('/api/admin/users', config);
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`/api/admin/users/${id}`, config);
      fetchUsers();
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="hms-badge hms-badge-emergency"><MdOutlineAdminPanelSettings className="mr-1" /> Admin</span>;
      case 'doctor':
        return <span className="hms-badge hms-badge-success"><MdLocalHospital className="mr-1" /> Doctor</span>;
      case 'lab_staff':
        return <span className="hms-badge hms-badge-info"><MdScience className="mr-1" /> Lab Staff</span>;
      default:
        return <span className="hms-badge hms-badge-pending"><MdPersonOutline className="mr-1" /> Patient</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="hms-heading-primary">User Management</h1>
          <p className="hms-body-text text-gray-600">View and manage all registered system users</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="hms-table">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                            <span className="font-bold text-sm">{user.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MdEmail className="mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 mx-2 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete User"
                      >
                        <MdBlock className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <MdPerson className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p>No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
