const express = require('express');
const {
	registerUser,
	loginUser,
	logoutUser,
	updateUserProfile,
	editUserRole,
} = require('../controllers/userControllers');
const {
	authenticateUser,
	authorizePermissions,
} = require('../middleware/auth');
const router = express.Router();
const { validateUser } = require('../middleware/validation');
// Register
router.post('/register', validateUser, registerUser);

// Login
router.post('/login', loginUser);

// Logout (Authenticated users only)
router.post('/logout', authenticateUser, logoutUser);

// Update Profile (Authenticated users only)
router.put('/update-profile', authenticateUser, updateUserProfile);

// Edit Role (Admin only)
router.put(
	'/edit-role/:userId',
	authenticateUser,
	authorizePermissions('admin'),
	editUserRole
);

module.exports = router;
