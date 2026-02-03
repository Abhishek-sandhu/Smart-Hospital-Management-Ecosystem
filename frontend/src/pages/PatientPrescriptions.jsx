import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdLocalPharmacy, MdReceipt, MdMedicalServices, MdLocalHospital, MdLocalPharmacy as MdPills, MdDownload, MdSecurity } from 'react-icons/md';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get('http://localhost:5000/api/patient/prescriptions', config);
    setPrescriptions(res.data);
  };

  const downloadPrescription = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}`, responseType: 'blob' } };
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/prescription/${id}/download`, config);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${id}.pdf`);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
          <p className="text-gray-600">View and download your medical prescriptions</p>
        </div>

        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdLocalPharmacy className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
              <p className="text-gray-600">You don&apos;t have any prescriptions yet.</p>
            </div>
          ) : (
            prescriptions.map((pres) => (
              <div key={pres._id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                      <MdReceipt className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Prescription</h3>
                      <p className="text-gray-600">by Dr. {pres.doctor.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Date Issued</p>
                    <p className="text-gray-900 font-semibold">{new Date(pres.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MdMedicalServices className="text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">Diagnosis</span>
                    </div>
                    <p className="text-gray-900 font-medium">{pres.diagnosis || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MdLocalHospital className="text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">Doctor</span>
                    </div>
                    <p className="text-gray-900 font-medium">Dr. {pres.doctor.name}</p>
                    <p className="text-sm text-gray-600">{pres.doctor.specialization}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <MdPills className="text-indigo-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-900">Medicines</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pres.medicines.map((med, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{med.name}</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="text-blue-600 font-medium">Dosage:</span> {med.dosage}</p>
                              <p><span className="text-green-600 font-medium">Frequency:</span> {med.frequency}</p>
                              <p><span className="text-yellow-600 font-medium">Duration:</span> {med.duration}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <MdLocalPharmacy className="text-white text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => downloadPrescription(pres._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  >
                    <MdDownload className="inline mr-2" />Download PDF
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {prescriptions.length > 0 && (
          <div className="mt-8 bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <MdSecurity className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Prescription Security</h3>
            </div>
            <p className="text-gray-600 text-sm">
              All prescriptions are digitally signed and stored securely. Download them anytime for your records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;