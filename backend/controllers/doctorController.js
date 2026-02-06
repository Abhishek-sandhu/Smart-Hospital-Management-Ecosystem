const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const Emergency = require('../models/Emergency');

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
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address', 'specialization', 'experience', 'availability', 'consultationFee'];
    const isValid = Object.keys(updates).every(key => allowedUpdates.includes(key));
    if (!isValid) return res.status(400).json({ error: 'Invalid updates' });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id, status: { $in: ['confirmed', 'completed'] } }).populate('patient');
    const patients = appointments.map(app => app.patient);
    const uniquePatients = patients.filter((pat, index, self) => self.findIndex(p => p._id.toString() === pat._id.toString()) === index);
    res.json(uniquePatients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await User.find({
      role: 'patient',
      $or: [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') }
      ]
    });
    res.json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ doctor: req.user._id, patient: patientId }).populate('patient');
    const prescriptions = await Prescription.find({ doctor: req.user._id, patient: patientId });
    const reports = await LabReport.find({ patient: patientId });
    res.json({ appointments, prescriptions, reports });
  } catch (error) {
    console.error('Error getting patient history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await Appointment.find({
      doctor: req.user._id,
      date: today
    }).populate('patient');
    res.json(appointments);
  } catch (error) {
    console.error('Error getting todays appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { patient, medicines, diagnosis, notes } = req.body;
    
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
    
    const prescription = new Prescription({ 
      patient: patientUser._id, 
      doctor: req.user._id, 
      medicines, 
      diagnosis, 
      notes 
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id }).populate('patient');
    res.json(prescriptions);
  } catch (error) {
    console.error('Error getting prescriptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const updates = req.body;
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!prescription || prescription.doctor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({}).populate('patient'); // In full system, filter by doctor's patients
    res.json(reports);
  } catch (error) {
    console.error('Error getting lab reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const requestLabTest = async (req, res) => {
  try {
    const { patient, testName } = req.body;
    
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
    
    // Mock: In real, send to lab
    const report = new LabReport({ patient: patientUser._id, testName, status: 'pending' });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error requesting lab test:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const markCriticalReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    report.critical = true;
    await report.save();
    res.json(report);
  } catch (error) {
    console.error('Error marking critical report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEmergencyQueue = async (req, res) => {
  try {
    const emergencies = await Emergency.find().populate('patient').sort({ priority: -1, createdAt: 1 });
    res.json(emergencies);
  } catch (error) {
    console.error('Error getting emergency queue:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const setEmergencyPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, { priority }, { new: true });
    res.json(emergency);
  } catch (error) {
    console.error('Error setting emergency priority:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const handleEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    emergency.status = 'in-progress';
    emergency.assignedDoctor = req.user._id;
    await emergency.save();
    res.json(emergency);
  } catch (error) {
    console.error('Error handling emergency:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const closeEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    res.json(emergency);
  } catch (error) {
    console.error('Error closing emergency:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = await Appointment.countDocuments({ doctor: req.user._id, date: today });
    const totalPatients = await Appointment.distinct('patient', { doctor: req.user._id }).then(patients => patients.length);
    const emergenciesHandled = await Emergency.countDocuments({ assignedDoctor: req.user._id, status: 'resolved' });
    // Revenue: mock, in real calculate from bills
    const revenue = 0; // Placeholder
    res.json({ todaysAppointments, totalPatients, emergenciesHandled, revenue });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPatients,
  searchPatients,
  getPatientHistory,
  getTodaysAppointments,
  updateAppointmentStatus,
  createPrescription,
  getPrescriptions,
  updatePrescription,
  getLabReports,
  requestLabTest,
  markCriticalReport,
  getEmergencyQueue,
  setEmergencyPriority,
  handleEmergency,
  closeEmergency,
  getAnalytics
};