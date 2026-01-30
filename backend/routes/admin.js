const express = require('express');
const { getUsers, manageMedicineStock, getMedicines, createBill, approveInsurance, manageEmergencyQueue } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.use(auth);
router.use(role('admin'));
router.get('/users', getUsers);
router.post('/medicine', manageMedicineStock);
router.get('/medicines', getMedicines);
router.post('/bill', createBill);
router.post('/insurance', approveInsurance);
router.get('/emergencies', manageEmergencyQueue);

module.exports = router;