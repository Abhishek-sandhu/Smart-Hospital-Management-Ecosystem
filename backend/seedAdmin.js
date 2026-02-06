const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 8);
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@hospital.com',
      password: hashedPassword,
      role: 'admin',
      uniqueId: 'ADM001'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@hospital.com');
    console.log('🔒 Password: admin123');
    console.log('🆔 Unique ID: ADM001');

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();