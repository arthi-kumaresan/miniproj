const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @desc    Login user & get token
// @route   POST /api/auth/login
router.post('/login', loginUser);

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', registerUser);

// @desc    Get current user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
