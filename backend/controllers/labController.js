const LabReport = require('../models/LabReport');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const uploadReport = async (req, res) => {
  try {
    const { patient, testName, testDate, results, remarks, critical } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    // Find patient by uniqueId or _id if valid ObjectId
    let query = { role: 'patient' };
    if (require('mongoose').Types.ObjectId.isValid(patient)) {
      query.$or = [
        { uniqueId: patient },
        { _id: patient }
      ];
    } else {
      query.uniqueId = patient;
    }

    const patientUser = await User.findOne(query);

    if (!patientUser) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const report = new LabReport({
      patient: patientUser._id,
      testName,
      testDate,
      results,
      remarks,
      critical: critical === 'true' || critical === true,
      fileUrl,
      uploadedBy: req.user._id
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);
    report.status = 'completed';
    await report.save();
    res.json(report);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { uploadReport, updateReportStatus };