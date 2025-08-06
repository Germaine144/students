// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// --- 1. IMPORT ALL NECESSARY FUNCTIONS & MIDDLEWARE ---
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// --- 2. DEFINE PUBLIC ROUTES (no token needed) ---
// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);


// --- 3. DEFINE PROTECTED ADMIN ROUTE ---
// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, getAllUsers);
//  ^          ^        ^      ^
//  |          |        |      |
//  |          |        |      +-- This is the function that runs if all checks pass
//  |          |        +--------- This middleware checks if the user's role is 'admin'
//  |          +------------------- This middleware checks if the token is valid
//  +------------------------------ This is the URL for the route


// --- 4. EXPORT THE ROUTER ---
module.exports = router;