const express = require('express');
const { getUsers, manageMedicineStock, getMedicines, createBill, getBills, updateBillStatus, approveInsurance, getInsurances, manageEmergencyQueue, createDoctor, deleteDoctor, createLabStaff, deleteLabStaff, getProfile, updateProfile, getAuditLogs, getAnalytics } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.use(auth);
router.use(role('admin'));
router.get('/users', getUsers);
router.post('/medicine', manageMedicineStock);
router.get('/medicines', getMedicines);
router.post('/bill', createBill);
router.get('/bills', getBills);
router.put('/bill/:id/status', updateBillStatus);
router.post('/insurance', approveInsurance);
router.get('/insurances', getInsurances);
router.get('/emergencies', manageEmergencyQueue);
router.post('/doctor', createDoctor);
router.delete('/doctor/:id', deleteDoctor);
router.post('/lab-staff', createLabStaff);
router.delete('/lab-staff/:id', deleteLabStaff);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/audit-logs', getAuditLogs);
router.get('/analytics', getAnalytics);

module.exports = router;