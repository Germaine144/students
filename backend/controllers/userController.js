// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register a new user (public) ---
const registerUser = async (req, res) => { /* ... existing code ... */ };

// --- Authenticate user & get token (Login) ---
const loginUser = async (req, res) => { /* ... existing code ... */ };

// --- Get all users (for Admin) ---
const getAllUsers = async (req, res) => { /* ... existing code ... */ };

// --- Delete a user (for Admin) ---
const deleteUser = async (req, res) => { /* ... existing code ... */ };

// --- Update a user's role (for Admin) ---
const updateUserRole = async (req, res) => { /* ... existing code ... */ };

// --- Add a new user (by an Admin) ---
const addUserByAdmin = async (req, res) => {
  const { fullName, email, password, role, phoneNumber, courseOfStudy } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Please enter full name, email, and password' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    user = new User({
      fullName,
      email,
      password,
      role: role || 'student',
      phoneNumber,
      courseOfStudy,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (err) {
    console.error('ADD USER BY ADMIN ERROR:', err.message);
    res.status(500).send('Server error');
  }
};


// --- THIS IS THE MOST IMPORTANT PART ---
// Make sure ALL functions are exported.
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
  addUserByAdmin, // <--- This was likely the missing piece
};