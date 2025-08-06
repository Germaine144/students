// // backend/controllers/userController.js

// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // --- Register a new user (public) ---
// const registerUser = async (req, res) => { /* ... existing code ... */ };

// // --- Authenticate user & get token (Login) ---
// const loginUser = async (req, res) => { /* ... existing code ... */ };

// // --- Get all users (for Admin) ---
// const getAllUsers = async (req, res) => { /* ... existing code ... */ };

// // --- Delete a user (for Admin) ---
// const deleteUser = async (req, res) => { /* ... existing code ... */ };

// // --- Update a user's role (for Admin) ---
// const updateUserRole = async (req, res) => { /* ... existing code ... */ };

// // --- Add a new user (by an Admin) ---
// const addUserByAdmin = async (req, res) => {
//   const { fullName, email, password, role, phoneNumber, courseOfStudy } = req.body;

//   if (!fullName || !email || !password) {
//     return res.status(400).json({ msg: 'Please enter full name, email, and password' });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User with this email already exists' });
//     }

//     user = new User({
//       fullName,
//       email,
//       password,
//       role: role || 'student',
//       phoneNumber,
//       courseOfStudy,
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     const savedUser = await user.save();
//     res.status(201).json(savedUser);

//   } catch (err) {
//     console.error('ADD USER BY ADMIN ERROR:', err.message);
//     res.status(500).send('Server error');
//   }
// };


// // --- THIS IS THE MOST IMPORTANT PART ---
// // Make sure ALL functions are exported.
// module.exports = {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   deleteUser,
//   updateUserRole,
//   addUserByAdmin, // <--- This was likely the missing piece
// };

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ fullName, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: 'User registered successfully.' });
  } catch (err) {
    console.error('REG ERROR:', err.message);
    res.status(500).send('Server error');
  }
};

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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = user.role === 'admin' ? 'student' : 'admin';
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

const addUserByAdmin = async (req, res) => {
  const { fullName, email, password, role, phoneNumber, courseOfStudy } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ msg: 'Full name, email, and password are required' });
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ fullName, email, password, role: role || 'student', phoneNumber, courseOfStudy });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('ADD USER ERROR:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { registerUser, loginUser, getAllUsers, deleteUser, updateUserRole, addUserByAdmin };