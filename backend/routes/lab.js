const express = require('express');
const { uploadReport, updateReportStatus } = require('../controllers/labController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.use(auth);
router.use(role('lab'));
router.post('/report', upload.single('file'), uploadReport);
router.put('/report/:id/status', updateReportStatus);

module.exports = router;