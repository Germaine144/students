// backend/controllers/userController.js
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (public sign-up)
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ fullName, email, password, role: 'student' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const savedUser = await user.save();

    const newStudentRecord = new Student({ user: savedUser._id });
    await newStudentRecord.save();

    res.status(201).json({ msg: 'User registered successfully. Please log in.' });
  } catch (err) {
    console.error('REGISTRATION ERROR:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Please provide credentials' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get current logged-in user's profile
const getMyProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Update current logged-in user's profile
// @route   PUT /api/users/profile
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      const updatedUser = await user.save();
      
      // If user is a student, also update their Student record (but NOT status)
      if (user.role === 'student') {
        const student = await Student.findOne({ user: user._id });
        if (student) {
          student.courseOfStudy = req.body.courseOfStudy || student.courseOfStudy;
          student.enrollmentYear = req.body.enrollmentYear || student.enrollmentYear;
          // Note: Status is NOT updated here - only admins can change status
          await student.save();
        }
      }
      
      res.json(updatedUser);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};