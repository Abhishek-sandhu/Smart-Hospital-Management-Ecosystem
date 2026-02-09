const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const mongoose = require('mongoose');

const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'lab', 'admin').required(),
    phone: Joi.string(),
    address: Joi.string(),
    dateOfBirth: Joi.date(),
    gender: Joi.string(),
    specialization: Joi.string(),
    experience: Joi.number(),
    consultationFee: Joi.number(),
    department: Joi.string()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password, role, phone, address, dateOfBirth, gender, specialization, experience, consultationFee, department } = req.body;

  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send({ error: 'Database not connected. Please set up MongoDB Atlas.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate unique ID based on role
    const rolePrefix = role === 'patient' ? 'PAT' : role === 'doctor' ? 'DOC' : 'LAB';
    const count = await User.countDocuments({ role }) + 1;
    const uniqueId = `${rolePrefix}${count.toString().padStart(3, '0')}`;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      uniqueId,
      phone,
      address,
      dateOfBirth,
      gender,
      specialization,
      experience,
      consultationFee,
      department
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.status(201).send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        uniqueId: user.uniqueId
      }, token
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { email, password } = req.body;

  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send({ error: 'Database not connected. Please ensure MongoDB is running locally or set up MongoDB Atlas.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        uniqueId: user.uniqueId
      }, token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  res.send(req.user);
};

module.exports = { register, login, getMe };