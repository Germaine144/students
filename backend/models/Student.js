// backend/models/Student.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates the link to the User model
    required: true,
    unique: true,
  },
  courseOfStudy: { type: String, default: 'Undeclared' },
  enrollmentYear: { type: Number, default: new Date().getFullYear() },
  status: { type: String, enum: ['Active', 'Graduated', 'Dropped'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);