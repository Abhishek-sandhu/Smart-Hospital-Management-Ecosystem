const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: String,
  policyNumber: String,
  coverageAmount: Number,
  expiryDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Insurance', insuranceSchema);