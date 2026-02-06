const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabReport = require('../models/LabReport');
const Bill = require('../models/Bill');
const Emergency = require('../models/Emergency');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;
    const appointment = new Appointment({ patient: req.user._id, doctor, date, time, reason });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialization');
    res.json(appointments);
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    appointment.date = date;
    appointment.time = time;
    appointment.status = 'pending';
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor', 'name specialization');
    res.json(prescriptions);
  } catch (error) {
    console.error('Error getting prescriptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patient').populate('doctor');
    if (!prescription || prescription.patient._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription._id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Hospital Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Prescription', { align: 'center' });
    doc.moveDown();

    // Patient and Doctor info
    doc.fontSize(12);
    doc.text(`Patient: ${prescription.patient.name}`);
    doc.text(`Patient ID: ${prescription.patient.uniqueId}`);
    doc.text(`Doctor: Dr. ${prescription.doctor.name}`);
    doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`);
    doc.moveDown();

    if (prescription.diagnosis) {
      doc.text(`Diagnosis: ${prescription.diagnosis}`);
      doc.moveDown();
    }

    // Medicines
    doc.fontSize(14).text('Medicines:');
    doc.moveDown();
    prescription.medicines.forEach((med, index) => {
      doc.fontSize(12).text(`${index + 1}. ${med.name}`);
      if (med.dosage) doc.text(`   Dosage: ${med.dosage}`);
      if (med.frequency) doc.text(`   Frequency: ${med.frequency}`);
      if (med.duration) doc.text(`   Duration: ${med.duration}`);
      doc.moveDown();
    });

    if (prescription.notes) {
      doc.moveDown();
      doc.text(`Notes: ${prescription.notes}`);
    }

    doc.end();
  } catch (error) {
    console.error('Error downloading prescription:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({ patient: req.user._id });
    res.json(reports);
  } catch (error) {
    console.error('Error getting lab reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadLabReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);
    if (!report || report.patient.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Report not found' });
    }
    // If fileUrl, send file, else return data
    if (report.fileUrl) {
      res.download(report.fileUrl);
    } else {
      res.json(report);
    }
  } catch (error) {
    console.error('Error downloading lab report:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.user._id });
    res.json(bills);
  } catch (error) {
    console.error('Error getting bills:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('patient').populate('appointment');
    if (!bill || bill.patient._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill-${bill._id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Hospital Management System', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Bill Invoice', { align: 'center' });
    doc.moveDown();

    // Bill details
    doc.fontSize(12);
    doc.text(`Bill ID: ${bill._id}`);
    doc.text(`Patient: ${bill.patient.name}`);
    doc.text(`Patient ID: ${bill.patient.uniqueId}`);
    doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString()}`);
    doc.text(`Due Date: ${bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}`);
    doc.text(`Status: ${bill.status}`);
    doc.moveDown();

    if (bill.description) {
      doc.text(`Description: ${bill.description}`);
      doc.moveDown();
    }

    doc.fontSize(14).text(`Total Amount: $${bill.amount}`);
    doc.moveDown();

    doc.end();
  } catch (error) {
    console.error('Error downloading bill:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address', 'bloodGroup', 'insuranceId'];
    const isValid = Object.keys(updates).every(key => allowedUpdates.includes(key));
    if (!isValid) return res.status(400).json({ error: 'Invalid updates' });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const user = await User.findById(req.user._id);
    user.profilePhoto = req.file.path;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const requestEmergency = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const emergency = new Emergency({ patient: req.user._id, symptoms });
    await emergency.save();
    res.status(201).json(emergency);
  } catch (error) {
    console.error('Error requesting emergency:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEmergencyStatus = async (req, res) => {
  try {
    const emergency = await Emergency.findOne({ patient: req.user._id }).sort({ createdAt: -1 });
    if (!emergency) return res.status(404).json({ error: 'No emergency request' });
    res.json(emergency);
  } catch (error) {
    console.error('Error getting emergency status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }, 'name specialization');
    res.json(doctors);
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ error: 'Server error' });
  }
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