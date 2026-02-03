import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdSecurity, MdPerson, MdBusiness, MdCreditCard, MdAttachMoney, MdInfo, MdSettings, MdCheckCircle, MdCancel, MdSchedule, MdCheck, MdClose } from 'react-icons/md';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Insurance Management</h1>
          <p className="text-gray-600">Review and manage patient insurance claims and coverage</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <MdSecurity className="text-white text-lg" />
              </div>
              Insurance Claims
            </h2>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdPerson className="inline mr-2" />Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdBusiness className="inline mr-2" />Provider
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdCreditCard className="inline mr-2" />Policy Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <MdAttachMoney className="inline mr-2" />Coverage Amount
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
                  {insurances.map(ins => (
                    <tr key={ins._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ins.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ins.provider}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{ins.policyNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${ins.coverageAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          ins.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : ins.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ins.status === 'approved' ? <MdCheckCircle className="mr-1" /> :
                           ins.status === 'rejected' ? <MdCancel className="mr-1" /> :
                           <MdSchedule className="mr-1" />}
                          {ins.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {ins.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveInsurance(ins._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <MdCheck className="inline mr-1" />Approve
                            </button>
                            <button
                              onClick={() => rejectInsurance(ins._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <MdClose className="inline mr-1" />Reject
                            </button>
                          </>
                        )}
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

export default AdminInsurance;