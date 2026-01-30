const express = require('express');
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getPrescriptions,
  downloadPrescription,
  getLabReports,
  downloadLabReport,
  getBills,
  downloadBill,
  updateProfile,
  uploadProfilePhoto,
  requestEmergency,
  getEmergencyStatus,
  getDoctors
} = require('../controllers/patientController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.use(auth);
router.use(role('patient'));

// Appointments
router.post('/appointment', bookAppointment);
router.get('/appointments', getAppointments);
router.put('/appointment/:id/cancel', cancelAppointment);
router.put('/appointment/:id/reschedule', rescheduleAppointment);

// Prescriptions
router.get('/prescriptions', getPrescriptions);
router.get('/prescription/:id/download', downloadPrescription);

// Lab Reports
router.get('/lab-reports', getLabReports);
router.get('/lab-report/:id/download', downloadLabReport);

// Bills
router.get('/bills', getBills);
router.get('/bill/:id/download', downloadBill);

// Profile
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadProfilePhoto);

// Emergency
router.post('/emergency', requestEmergency);
router.get('/emergency/status', getEmergencyStatus);

// Doctors
router.get('/doctors', getDoctors);

module.exports = router;