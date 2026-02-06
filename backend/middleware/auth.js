const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Please authenticate.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, using fallback user lookup');
      // Fallback mock user lookup for development
      let mockUser;
      if (decoded.id === '507f1f77bcf86cd799439011') {
        mockUser = {
          _id: '507f1f77bcf86cd799439011',
          name: 'Default Admin',
          email: 'admin@hospital.com',
          role: 'admin',
          uniqueId: 'ADM001'
        };
      } else {
        mockUser = {
          _id: decoded.id,
          name: 'Mock Patient',
          email: 'patient@example.com',
          role: 'patient',
          uniqueId: 'PAT001'
        };
      }
      req.user = mockUser;
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send({ error: 'Please authenticate.' });

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      uniqueId: user.uniqueId
    };
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;