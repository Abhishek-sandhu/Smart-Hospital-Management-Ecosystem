import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdBiotech, MdScience, MdOutlineScience, MdDateRange, MdInfo, MdDownload, MdSchedule, MdCheckCircle, MdHelp } from 'react-icons/md';

const PatientLabReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('/api/patient/lab-reports', config);
    setReports(res.data);
  };

  const downloadReport = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, responseType: 'blob' } };
    try {
      const res = await axios.get(`/api/patient/lab-report/${id}/download`, config);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${id}.pdf`);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Lab Reports</h1>
          <p className="text-gray-600">View and download your laboratory test results</p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdBiotech className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lab Reports Found</h3>
            <p className="text-gray-600">You don&apos;t have any lab reports yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <MdScience className="text-white" />
                </div>
                Laboratory Test Results
              </h2>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <MdScience className="inline mr-2" />Test Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <MdDateRange className="inline mr-2" />Test Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <MdInfo className="inline mr-2" />Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <MdDownload className="inline mr-2" />Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                              <MdScience className="text-white text-sm" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{report.testName}</div>
                              <div className="text-sm text-gray-500">Lab Test</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(report.testDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            report.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : report.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status === 'completed' ? <MdCheckCircle className="mr-1" /> :
                             report.status === 'pending' ? <MdSchedule className="mr-1" /> : <MdHelp className="mr-1" />}
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {report.status === 'completed' && (
                            <button
                              onClick={() => downloadReport(report._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            >
                              <MdDownload className="inline mr-2" />Download
                            </button>
                          )}
                          {report.status === 'pending' && (
                            <span className="text-yellow-600 font-semibold flex items-center">
                              <MdSchedule className="mr-2" />Processing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {reports.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCheckCircle className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Completed Tests</h3>
              <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdSchedule className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pending Tests</h3>
              <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdScience className="text-2xl text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Total Tests</h3>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLabReports;
