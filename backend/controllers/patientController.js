const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const Bill = require('../models/Bill');
const Emergency = require('../models/Emergency');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const bookAppointment = async (req, res) => {
  const { doctor, date, time, reason } = req.body;
  const appointment = new Appointment({ patient: req.user._id, doctor, date, time, reason });
  await appointment.save();
  res.status(201).send(appointment);
};

const getAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialization');
  res.send(appointments);
};

const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment || appointment.patient.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Appointment not found' });
  }
  appointment.status = 'cancelled';
  await appointment.save();
  res.send(appointment);
};

const rescheduleAppointment = async (req, res) => {
  const { date, time } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment || appointment.patient.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Appointment not found' });
  }
  appointment.date = date;
  appointment.time = time;
  appointment.status = 'pending';
  await appointment.save();
  res.send(appointment);
};

const getPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor', 'name');
  res.send(prescriptions);
};

const downloadPrescription = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription || prescription.patient.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Prescription not found' });
  }
  // Generate PDF logic here, for now return JSON
  res.send(prescription);
};

const getLabReports = async (req, res) => {
  const reports = await LabReport.find({ patient: req.user._id });
  res.send(reports);
};

const downloadLabReport = async (req, res) => {
  const report = await LabReport.findById(req.params.id);
  if (!report || report.patient.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Report not found' });
  }
  // If fileUrl, send file, else return data
  if (report.fileUrl) {
    res.download(report.fileUrl);
  } else {
    res.send(report);
  }
};

const getBills = async (req, res) => {
  const bills = await Bill.find({ patient: req.user._id });
  res.send(bills);
};

const downloadBill = async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill || bill.patient.toString() !== req.user._id.toString()) {
    return res.status(404).send({ error: 'Bill not found' });
  }
  // Generate PDF invoice
  res.send(bill);
};

const updateProfile = async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ['name', 'phone', 'address', 'bloodGroup', 'insuranceId'];
  const isValid = Object.keys(updates).every(key => allowedUpdates.includes(key));
  if (!isValid) return res.status(400).send({ error: 'Invalid updates' });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.send(user);
};

const uploadProfilePhoto = async (req, res) => {
  if (!req.file) return res.status(400).send({ error: 'No file uploaded' });
  const user = await User.findById(req.user._id);
  user.profilePhoto = req.file.path;
  await user.save();
  res.send(user);
};

const requestEmergency = async (req, res) => {
  const { symptoms } = req.body;
  const emergency = new Emergency({ patient: req.user._id, symptoms });
  await emergency.save();
  res.status(201).send(emergency);
};

const getEmergencyStatus = async (req, res) => {
  const emergency = await Emergency.findOne({ patient: req.user._id }).sort({ createdAt: -1 });
  if (!emergency) return res.status(404).send({ error: 'No emergency request' });
  res.send(emergency);
};

const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }, 'name specialization');
  res.send(doctors);
};

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getPrescriptions,
  downloadPrescription,
  getLabReports,
  downloadLabReport,
  getBills,
  downloadBill,
  updateProfile,
  uploadProfilePhoto,
  requestEmergency,
  getEmergencyStatus,
  getDoctors
};