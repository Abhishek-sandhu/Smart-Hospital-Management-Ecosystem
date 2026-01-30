const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  amount: Number,
  description: String,
  status: { type: String, enum: ['unpaid', 'paid', 'overdue'], default: 'unpaid' },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);