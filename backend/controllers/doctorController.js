const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const Emergency = require('../models/Emergency');

const getProfile = async (req, res) => {
  res.send(req.user);
};

const updateProfile = async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ['name', 'phone', 'address', 'specialization', 'experience', 'availability', 'consultationFee'];
  const isValid = Object.keys(updates).every(key => allowedUpdates.includes(key));
  if (!isValid) return res.status(400).send({ error: 'Invalid updates' });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.send(user);
};

const getPatients = async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id, status: { $in: ['confirmed', 'completed'] } }).populate('patient');
  const patients = appointments.map(app => app.patient);
  const uniquePatients = patients.filter((pat, index, self) => self.findIndex(p => p._id.toString() === pat._id.toString()) === index);
  res.send(uniquePatients);
};

const searchPatients = async (req, res) => {
  const { query } = req.query;
  const patients = await User.find({
    role: 'patient',
    $or: [
      { name: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') }
    ]
  });
  res.send(patients);
};

const getPatientHistory = async (req, res) => {
  const { patientId } = req.params;
  const appointments = await Appointment.find({ doctor: req.user._id, patient: patientId }).populate('patient');
  const prescriptions = await Prescription.find({ doctor: req.user._id, patient: patientId });
  const reports = await LabReport.find({ patient: patientId });
  res.send({ appointments, prescriptions, reports });
};

const getTodaysAppointments = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointments = await Appointment.find({
    doctor: req.user._id,
    date: today
  }).populate('patient');
  res.send(appointments);
};

const updateAppointmentStatus = async (req, res) => {
  const { status, notes } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment || appointment.doctor.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Appointment not found' });
  }
  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();
  res.send(appointment);
};

const createPrescription = async (req, res) => {
  const { patient, medicines, diagnosis, notes } = req.body;
  const prescription = new Prescription({ patient, doctor: req.user._id, medicines, diagnosis, notes });
  await prescription.save();
  res.status(201).send(prescription);
};

const getPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ doctor: req.user._id }).populate('patient');
  res.send(prescriptions);
};

const updatePrescription = async (req, res) => {
  const updates = req.body;
  const prescription = await Prescription.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!prescription || prescription.doctor.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Prescription not found' });
  }
  res.send(prescription);
};

const getLabReports = async (req, res) => {
  const reports = await LabReport.find({}).populate('patient'); // In full system, filter by doctor's patients
  res.send(reports);
};

const requestLabTest = async (req, res) => {
  const { patient, testName } = req.body;
  // Mock: In real, send to lab
  const report = new LabReport({ patient, testName, status: 'pending' });
  await report.save();
  res.status(201).send(report);
};

const markCriticalReport = async (req, res) => {
  const report = await LabReport.findById(req.params.id);
  if (!report) return res.status(404).send({ error: 'Report not found' });
  report.critical = true;
  await report.save();
  res.send(report);
};

const getEmergencyQueue = async (req, res) => {
  const emergencies = await Emergency.find().populate('patient').sort({ priority: -1, createdAt: 1 });
  res.send(emergencies);
};

const setEmergencyPriority = async (req, res) => {
  const { priority } = req.body;
  const emergency = await Emergency.findByIdAndUpdate(req.params.id, { priority }, { new: true });
  res.send(emergency);
};

const handleEmergency = async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);
  emergency.status = 'in-progress';
  emergency.assignedDoctor = req.user._id;
  await emergency.save();
  res.send(emergency);
};

const closeEmergency = async (req, res) => {
  const emergency = await Emergency.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
  res.send(emergency);
};

const getAnalytics = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = await Appointment.countDocuments({ doctor: req.user._id, date: today });
  const totalPatients = await Appointment.distinct('patient', { doctor: req.user._id }).then(patients => patients.length);
  const emergenciesHandled = await Emergency.countDocuments({ assignedDoctor: req.user._id, status: 'resolved' });
  // Revenue: mock, in real calculate from bills
  const revenue = 0; // Placeholder
  res.send({ todaysAppointments, totalPatients, emergenciesHandled, revenue });
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