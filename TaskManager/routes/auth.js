const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin, validateProfileUpdate, validatePasswordChange } = require('../middleware/validation');

// Register new user
router.post('/register', validateRegister, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Logout user
router.post('/logout', authController.logout);

// Get current user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

// Update user profile (protected route)
router.put('/profile', authenticateToken, validateProfileUpdate, authController.updateProfile);

// Change user password (protected route)
router.post('/change-password', authenticateToken, validatePasswordChange, authController.changePassword);

module.exports = router; 