const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Middleware to check database connection for protected routes
const checkDBConnection = (req, res, next) => {
  // Allow auth routes even if DB not connected (they handle it internally)
  if (req.path.startsWith('/api/auth')) {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not available. Please try again later.' });
  }
  next();
};

// Apply DB check to all API routes
app.use('/api', checkDBConnection);

// Start server function
const startServer = async () => {
  const dbConnected = await connectDB();

  if (!dbConnected) {
    console.log('⚠️  Starting server in offline mode - database features will not work');
  } else {
    console.log('🚀 Server is ready to accept connections');
  }

  // Handle mongoose connection events
  mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('📡 Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('📡 Mongoose disconnected');
  });

  const authRoutes = require('./routes/auth');
  const patientRoutes = require('./routes/patient');
  const doctorRoutes = require('./routes/doctor');
  const adminRoutes = require('./routes/admin');
  const labRoutes = require('./routes/lab');

  app.use('/api/auth', authRoutes);
  app.use('/api/patient', patientRoutes);
  app.use('/api/doctor', doctorRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/lab', labRoutes);

  const PORT = process.env.PORT || 3000;

  // Function to find next available port
  const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
      const server = require('net').createServer();
      server.listen(startPort, '127.0.0.1', () => {
        server.close(() => resolve(startPort));
      });
      server.on('error', () => {
        // Port busy, try next one
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      });
    });
  };

  // Find available port and start server
  findAvailablePort(PORT).then(availablePort => {
    const server = app.listen(availablePort, '127.0.0.1', () => {
      console.log(`🚀 Server running on port ${availablePort}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (availablePort !== PORT) {
        console.log(`ℹ️  Note: Default port ${PORT} was busy, using ${availablePort} instead`);
      }
    });

    // Handle nodemon restarts (SIGUSR2)
    process.on('SIGUSR2', async () => {
      console.log('🔄 Nodemon restart detected, closing server gracefully...');
      server.close(async () => {
        console.log('🛑 Server closed for nodemon restart');
        await mongoose.connection.close();
        process.kill(process.pid, 'SIGUSR2');
      });
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Received SIGINT, shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`❌ Unhandled Promise Rejection: ${err.message}`);
      console.log('Stack:', err.stack);
      // Close server & exit process
      server.close(() => {
        console.log('🛑 Server closed due to unhandled promise rejection');
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.log(`❌ Uncaught Exception: ${err.message}`);
      console.log('Stack:', err.stack);
      process.exit(1);
    });
  }).catch(err => {
    console.error('❌ Failed to find available port:', err.message);
    process.exit(1);
  });
};

// Start the application
startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});