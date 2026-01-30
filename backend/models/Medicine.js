const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  expiryDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);