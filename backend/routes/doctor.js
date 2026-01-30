const express = require('express');
const {
  getProfile,
  updateProfile,
  getPatients,
  searchPatients,
  getPatientHistory,
  getTodaysAppointments,
  updateAppointmentStatus,
  createPrescription,
  getPrescriptions,
  updatePrescription,
  getLabReports,
  requestLabTest,
  markCriticalReport,
  getEmergencyQueue,
  setEmergencyPriority,
  handleEmergency,
  closeEmergency,
  getAnalytics
} = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.use(auth);
router.use(role('doctor'));

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Patients
router.get('/patients', getPatients);
router.get('/patients/search', searchPatients);
router.get('/patient/:patientId/history', getPatientHistory);

// Appointments
router.get('/appointments/today', getTodaysAppointments);
router.put('/appointment/:id/status', updateAppointmentStatus);

// Prescriptions
router.post('/prescription', createPrescription);
router.get('/prescriptions', getPrescriptions);
router.put('/prescription/:id', updatePrescription);

// Lab
router.get('/lab-reports', getLabReports);
router.post('/lab-test', requestLabTest);
router.put('/lab-report/:id/critical', markCriticalReport);

// Emergency
router.get('/emergencies', getEmergencyQueue);
router.put('/emergency/:id/priority', setEmergencyPriority);
router.put('/emergency/:id/handle', handleEmergency);
router.put('/emergency/:id/close', closeEmergency);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;