const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'lab'], required: true },
  uniqueId: { type: String, unique: true }, // Unique ID like PAT001, DOC001, etc.
  phone: String,
  address: String,
  dateOfBirth: Date,
  gender: String,
  // for doctor
  specialization: String,
  experience: Number, // years
  availability: [{ day: String, startTime: String, endTime: String }],
  consultationFee: Number,
  // for patient
  medicalHistory: [String],
  profilePhoto: String,
  bloodGroup: String,
  insuranceId: String,
  // for lab
  department: String, // Pathology, Radiology, etc.
  labId: String,
  // for admin
  permissions: [String], // e.g., ['manage_users', 'manage_inventory']
  isBlocked: { type: Boolean, default: false } // for patients
}, { timestamps: true });

// Pre-save hook to generate unique ID
userSchema.pre('save', function(next) {
  const self = this;
  if (!self.uniqueId) {
    const User = self.constructor;
    let prefix = '';

    switch (self.role) {
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
    User.findOne({ role: self.role }).sort({ uniqueId: -1 }).exec()
      .then(lastUser => {
        let count = 1;
        if (lastUser && lastUser.uniqueId) {
          const lastNumber = parseInt(lastUser.uniqueId.replace(prefix, ''));
          count = lastNumber + 1;
        }
        self.uniqueId = `${prefix}${count.toString().padStart(3, '0')}`;
        next();
      })
      .catch(err => {
        console.error('Error generating unique ID:', err);
        next(err);
      });
  } else {
    next();
  }
});

userSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);