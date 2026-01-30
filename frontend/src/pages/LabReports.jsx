import { useEffect, useState } from 'react';
import axios from 'axios';

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ remarks: '', critical: false });
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/lab/reports', config);
    setReports(res.data);
  };

  const handleEdit = (report) => {
    setEditing(report._id);
    setEditForm({ remarks: report.remarks || '', critical: report.critical });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditFile = (e) => setEditFile(e.target.files[0]);

  const saveEdit = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('remarks', editForm.remarks);
    formData.append('critical', editForm.critical);
    if (editFile) formData.append('file', editFile);

    try {
      await axios.put(`http://localhost:5000/api/lab/report/${editing}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setEditing(null);
      fetchReports();
      alert('Report updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  const downloadReport = (fileUrl) => {
    window.open(`http://localhost:5000/${fileUrl}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports History</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Test Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Critical</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td className="border px-4 py-2">{report.patient.name}</td>
                <td className="border px-4 py-2">{report.testName}</td>
                <td className="border px-4 py-2">{report.status}</td>
                <td className="border px-4 py-2">{report.critical ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2">
                  {editing === report._id ? (
                    <div>
                      <input name="remarks" value={editForm.remarks} onChange={handleEditChange} placeholder="Remarks" className="p-1 border rounded mb-1" />
                      <label className="flex items-center mb-1">
                        <input type="checkbox" name="critical" checked={editForm.critical} onChange={handleEditChange} className="mr-1" />
                        Critical
                      </label>
                      <input type="file" onChange={handleEditFile} accept=".pdf,.jpg,.png" className="p-1 border rounded mb-1" />
                      <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Save</button>
                      <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => handleEdit(report)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1">Edit</button>
                      {report.fileUrl && <button onClick={() => downloadReport(report.fileUrl)} className="bg-green-500 text-white px-2 py-1 rounded">Download</button>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabReports;