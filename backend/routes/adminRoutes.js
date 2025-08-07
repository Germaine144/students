// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addUserAndStudent,
  deleteUserAndStudent,
  updateUserRole,
  updateStudentStatus,
  getAllUsers,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Protect all routes in this file
router.use(protect, admin);

router.get('/students', getAllStudents);
router.put('/students/:id/status', updateStudentStatus); // :id is the USER id

router.post('/users', addUserAndStudent);
router.delete('/users/:id', deleteUserAndStudent);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateStudentStatus);
router.get('/users', getAllUsers);

module.exports = router;