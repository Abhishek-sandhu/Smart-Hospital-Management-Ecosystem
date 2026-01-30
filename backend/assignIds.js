const mongoose = require('mongoose');
const User = require('./models/User');

async function assignUniqueIds() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hospital-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({ uniqueId: { $exists: false } });

    for (const user of users) {
      let prefix = '';
      let count = 0;

      switch (user.role) {
        case 'patient':
          prefix = 'PAT';
          break;
        case 'doctor':
          prefix = 'DOC';
          break;
        case 'lab':
          prefix = 'LAB';
          break;
        case 'admin':
          prefix = 'ADM';
          break;
        default:
          prefix = 'USR';
      }

      // Find the highest number for this role
      const lastUser = await User.findOne({ role: user.role, uniqueId: { $exists: true } }).sort({ uniqueId: -1 });
      if (lastUser && lastUser.uniqueId) {
        const lastNumber = parseInt(lastUser.uniqueId.replace(prefix, ''));
        count = lastNumber + 1;
      } else {
        // Count existing users of this role to start numbering
        const roleCount = await User.countDocuments({ role: user.role });
        count = roleCount;
      }

      user.uniqueId = `${prefix}${count.toString().padStart(3, '0')}`;
      await user.save();
      console.log(`Assigned ID ${user.uniqueId} to ${user.name}`);
    }

    console.log('Unique ID assignment completed');
    process.exit(0);
  } catch (error) {
    console.error('Error assigning unique IDs:', error);
    process.exit(1);
  }
}

assignUniqueIds();