// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ fullName, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({
      msg: 'User registered successfully.',
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    console.error('REGISTRATION ERROR:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Find all users, exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
};

// This exports all three functions so they can be used in your routes file.
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};