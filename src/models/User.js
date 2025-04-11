const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'admin', 'mentor'],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  profile: {
    college: String,
    graduationYear: Number,
    currentCompany: String,
    position: String,
    skills: [String],
    expertise: [String],
    yearsOfExperience: Number,
    bio: String,
    avatar: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema); 