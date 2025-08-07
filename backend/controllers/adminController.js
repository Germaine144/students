// backend/controllers/adminController.js
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// @desc    Get all students with their user details
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate('user', 'fullName email phoneNumber');
    res.json(students);
  } catch (error) {
    console.error('GET ALL STUDENTS ERROR:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new user and student record (by Admin)
// @route   POST /api/admin/users
const addUserAndStudent = async (req, res) => {
  const { fullName, email, password, role, phoneNumber, courseOfStudy, enrollmentYear, status } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Full name, email, and password are required.' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'A user with this email already exists.' });
    user = new User({ fullName, email, password, role: role || 'student', phoneNumber });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const savedUser = await user.save();

    if (savedUser.role === 'student') {
      const newStudentRecord = new Student({
        user: savedUser._id,
        courseOfStudy,
        enrollmentYear,
        status: status || 'Active'
      });
      await newStudentRecord.save();
    }
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('ADD USER BY ADMIN ERROR:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete a user and their linked student record
const deleteUserAndStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'student') {
        await Student.deleteOne({ user: user._id });
      }
      await user.deleteOne();
      res.json({ message: 'User and associated records removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a user's role
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = user.role === 'admin' ? 'student' : 'admin';
      await user.save();
      res.json({ message: `User role updated to ${user.role}` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('UPDATE ROLE ERROR:', error);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a student's status
const updateStudentStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.id });
    if (student) {
      student.status = req.body.status || student.status;
      await student.save();
      res.json({ message: 'Student status updated.' });
    } else {
      res.status(404).json({ message: 'Student record not found.' });
    }
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    res.status(500).send('Server Error');
  }
};

// Get all users (for admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password');
    // Get all student records and map by user id
    const students = await Student.find();
    const studentMap = {};
    students.forEach(s => {
      studentMap[s.user.toString()] = {
        courseOfStudy: s.courseOfStudy,
        enrollmentYear: s.enrollmentYear,
        status: s.status
      };
    });
    // Merge student info into users
    const usersWithStudentInfo = users.map(u => {
      const userObj = u.toObject();
      if (userObj.role === 'student' && studentMap[userObj._id.toString()]) {
        userObj.courseOfStudy = studentMap[userObj._id.toString()].courseOfStudy;
        userObj.enrollmentYear = studentMap[userObj._id.toString()].enrollmentYear;
        userObj.status = studentMap[userObj._id.toString()].status;
      }
      return userObj;
    });
    res.json(usersWithStudentInfo);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getAllStudents,
  addUserAndStudent,
  deleteUserAndStudent,
  updateUserRole,
  updateStudentStatus,
  getAllUsers,
};