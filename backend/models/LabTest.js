const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // requesting doctor
  testName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  cost: Number,
  remarks: String,
  assignedLabStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateRequested: { type: Date, default: Date.now },
  dateCompleted: Date
}, { timestamps: true });

module.exports = mongoose.model('LabTest', labTestSchema);