const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  symptoms: String,
  status: { type: String, enum: ['waiting', 'in-progress', 'resolved'], default: 'waiting' },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);