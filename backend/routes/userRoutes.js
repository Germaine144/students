// // backend/routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   deleteUser,
//   updateUserRole,
//   addUserByAdmin, // <--- Make sure this is imported
// } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');
// const { admin } = require('../middleware/adminMiddleware');

// // Public Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Admin Routes
// router.get('/', protect, admin, getAllUsers);
// router.delete('/:id', protect, admin, deleteUser);
// router.put('/:id/role', protect, admin, updateUserRole);
// router.post('/add', protect, admin, addUserByAdmin); // <--- Make sure this route exists

// module.exports = router;


const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, deleteUser, updateUserRole, addUserByAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only Routes
router.post('/add', protect, admin, addUserByAdmin);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;