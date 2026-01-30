const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');

const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'lab').required(),
    phone: Joi.string(),
    address: Joi.string(),
    dateOfBirth: Joi.date(),
    gender: Joi.string()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, email, password, role, phone, address, dateOfBirth, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = new User({ name, email, password: hashedPassword, role, phone, address, dateOfBirth, gender });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(201).send({ user, token });
};

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.send({ user, token });
};

const getMe = async (req, res) => {
  res.send(req.user);
};

module.exports = { register, login, getMe };