const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testName: String,
  testDate: Date,
  results: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  critical: { type: Boolean, default: false },
  fileUrl: String, // for uploaded PDF/Image
  remarks: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  auditLogs: [{
    action: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LabReport', labReportSchema);