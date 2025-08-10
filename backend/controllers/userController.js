// backend/controllers/userController.js
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (public sign-up)
// This function is correct. No changes needed.
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
// This function is correct. No changes needed.
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
// --- CORRECTED FUNCTION ---
// This now fetches data from both the User and Student models and combines them.
const getMyProfile = async (req, res) => {
  try {
    // req.user comes from your authentication middleware (it's the User model data)
    const user = req.user;

    // If the user is a student, we need to get their student-specific data
    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id });

      if (student) {
        // Merge the user object and the student object into one
        const combinedProfile = {
          ...user.toObject(),     // Convert Mongoose document to a plain object
          ...student.toObject(),  // Add student-specific fields
        };
        // Return the complete, combined profile
        return res.json(combinedProfile);
      }
    }
    
    // If the user is an admin or no student record was found, return the basic user profile
    res.json(user);

  } catch (error) {
    console.error('GET PROFILE ERROR:', error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update current logged-in user's profile
// --- CORRECTED FUNCTION ---
// This now updates both models and returns the combined, updated data.
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // 1. Update fields on the User model
      user.fullName = req.body.fullName || user.fullName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      const updatedUser = await user.save();
      
      let combinedProfile = updatedUser.toObject();

      // 2. If user is a student, also update their separate Student record
      if (user.role === 'student') {
        const student = await Student.findOne({ user: user._id });
        if (student) {
          student.courseOfStudy = req.body.courseOfStudy || student.courseOfStudy;
          student.enrollmentYear = req.body.enrollmentYear || student.enrollmentYear;
          const updatedStudent = await student.save();
          
          // 3. Merge the updated data from both models for the response
          combinedProfile = { ...updatedUser.toObject(), ...updatedStudent.toObject() };
        }
      }
      
      // 4. Return the fully combined and updated profile
      res.json(combinedProfile);

    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};