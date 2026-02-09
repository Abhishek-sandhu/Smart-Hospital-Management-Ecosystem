const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Bill = require('../models/Bill');
const Insurance = require('../models/Insurance');
const Emergency = require('../models/Emergency');
const AuditLog = require('../models/AuditLog');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role uniqueId');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const manageMedicineStock = async (req, res) => {
  try {
    const { name, stock, price, expiryDate } = req.body;
    const medicine = new Medicine({ name, stock, price, expiryDate });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Error managing medicine stock:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error('Error getting medicines:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createBill = async (req, res) => {
  try {
    const { patient, appointment, amount, description, dueDate } = req.body;

    // Find patient by uniqueId or _id if valid ObjectId
    let patientQuery = { role: 'patient' };
    if (require('mongoose').Types.ObjectId.isValid(patient)) {
      patientQuery.$or = [
        { uniqueId: patient },
        { _id: patient }
      ];
    } else {
      patientQuery.uniqueId = patient;
    }

    const patientUser = await User.findOne(patientQuery);

    if (!patientUser) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const bill = new Bill({
      patient: patientUser._id,
      appointment,
      amount,
      description,
      dueDate
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('patient', 'name email').populate('appointment', 'date');
    res.json(bills);
  } catch (error) {
    console.error('Error getting bills:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const approveInsurance = async (req, res) => {
  try {
    const { patient, provider, policyNumber, coverageAmount, expiryDate } = req.body;
    const insurance = new Insurance({ patient, provider, policyNumber, coverageAmount, expiryDate });
    await insurance.save();
    res.status(201).json(insurance);
  } catch (error) {
    console.error('Error approving insurance:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const manageEmergencyQueue = async (req, res) => {
  try {
    const emergencies = await Emergency.find().sort({ priority: -1 });
    res.json(emergencies);
  } catch (error) {
    console.error('Error managing emergency queue:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, address, specialization, experience, availability, consultationFee } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const count = await User.countDocuments({ role: 'doctor' }) + 1;
    const uniqueId = `DOC${count.toString().padStart(3, '0')}`;
    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      uniqueId,
      phone,
      address,
      specialization,
      experience,
      availability,
      consultationFee
    });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createLabStaff = async (req, res) => {
  try {
    const { name, email, password, phone, address, department, labId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const count = await User.countDocuments({ role: 'lab' }) + 1;
    const uniqueId = `LAB${count.toString().padStart(3, '0')}`;
    const labStaff = new User({
      name,
      email,
      password: hashedPassword,
      role: 'lab',
      uniqueId,
      phone,
      address,
      department,
      labId
    });
    await labStaff.save();
    res.status(201).json(labStaff);
  } catch (error) {
    console.error('Error creating lab staff:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteLabStaff = async (req, res) => {
  try {
    const labStaff = await User.findByIdAndDelete(req.params.id);
    if (!labStaff) {
      return res.status(404).json({ error: 'Lab staff not found' });
    }
    res.json({ message: 'Lab staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab staff:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true });
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user', 'name email').sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find().populate('patient', 'name email uniqueId');
    res.json(insurances);
  } catch (error) {
    console.error('Error getting insurances:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bill = await Bill.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUsers, manageMedicineStock, getMedicines, createBill, getBills, updateBillStatus, approveInsurance, getInsurances, manageEmergencyQueue, createDoctor, deleteDoctor, createLabStaff, deleteLabStaff, getProfile, updateProfile, getAuditLogs, getAnalytics };