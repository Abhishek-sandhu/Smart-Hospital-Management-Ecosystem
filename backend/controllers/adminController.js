const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Bill = require('../models/Bill');
const Insurance = require('../models/Insurance');
const Emergency = require('../models/Emergency');

const getUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

const manageMedicineStock = async (req, res) => {
  const { name, stock, price, expiryDate } = req.body;
  const medicine = new Medicine({ name, stock, price, expiryDate });
  await medicine.save();
  res.status(201).send(medicine);
};

const getMedicines = async (req, res) => {
  const medicines = await Medicine.find();
  res.send(medicines);
};

const createBill = async (req, res) => {
  const { patient, appointment, amount, description, dueDate } = req.body;
  const bill = new Bill({ patient, appointment, amount, description, dueDate });
  await bill.save();
  res.status(201).send(bill);
};

const approveInsurance = async (req, res) => {
  const { patient, provider, policyNumber, coverageAmount, expiryDate } = req.body;
  const insurance = new Insurance({ patient, provider, policyNumber, coverageAmount, expiryDate });
  await insurance.save();
  res.status(201).send(insurance);
};

const manageEmergencyQueue = async (req, res) => {
  const emergencies = await Emergency.find().sort({ priority: -1 });
  res.send(emergencies);
};

module.exports = { getUsers, manageMedicineStock, getMedicines, createBill, approveInsurance, manageEmergencyQueue };