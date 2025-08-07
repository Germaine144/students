// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['student', 'admin'], default: 'student' },
  
//   // --- NEW FIELDS ADDED HERE ---
//   phoneNumber: { type: String, default: '' },
//   courseOfStudy: { type: String, default: '' },
//   profilePicture: { type: String, default: '' }, // URL to the image

// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['student', 'admin'], default: 'student' },
//   phoneNumber: { type: String, default: '' },
//   courseOfStudy: { type: String, default: '' },
//   profilePicture: { type: String, default: '' },
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);


// backend/models/User.js (Updated)
// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  phoneNumber: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);