// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Connects POST /api/users/register to the registerUser function
router.post('/register', registerUser);

// Connects POST /api/users/login to the loginUser function
router.post('/login', loginUser);

module.exports = router;