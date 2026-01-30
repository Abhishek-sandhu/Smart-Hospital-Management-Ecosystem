const LabReport = require('../models/LabReport');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const uploadReport = async (req, res) => {
  const { patient, testName, testDate, results } = req.body;
  const fileUrl = req.file ? req.file.path : null;
  const report = new LabReport({ patient, testName, testDate, results, fileUrl, uploadedBy: req.user._id });
  await report.save();
  res.status(201).send(report);
};

const updateReportStatus = async (req, res) => {
  const report = await LabReport.findById(req.params.id);
  report.status = 'completed';
  await report.save();
  res.send(report);
};

module.exports = { uploadReport, updateReportStatus };