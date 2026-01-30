import { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>
      <div className="space-y-4">
        {prescriptions.map(pres => (
          <div key={pres._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Prescription by Dr. {pres.doctor.name}</h3>
            <p><strong>Date:</strong> {new Date(pres.date).toLocaleDateString()}</p>
            <p><strong>Diagnosis:</strong> {pres.diagnosis}</p>
            <p><strong>Medicines:</strong></p>
            <ul className="list-disc list-inside mb-4">
              {pres.medicines.map((med, idx) => (
                <li key={idx}>{med.name} - {med.dosage} - {med.frequency} - {med.duration}</li>
              ))}
            </ul>
            <button onClick={() => downloadPrescription(pres._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescriptions;