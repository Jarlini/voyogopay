const express = require('express');
const router = express.Router();

// Import controller functions
const {
    register,
    login,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    getGroup1Users,
    getGroup2Users,
    getGroup3Users
} = require('../controllers/authcontrollers');

// Middleware for authentication and admin routes
const auth = require('../middleware/authmiddleware');
const adminAuth = require('../middleware/adminauthmidele');

// Public routes
router.post('/login', login);       // Login route
router.post('/register', register); // Registration route

// Protected routes (requires authentication)
router.get('/users', auth, getAllUsers);  // Fetch all users (authenticated users only)
router.get('/users/:id', auth, getUserById); // Fetch user by ID

// Fetch users by group
router.get('/group1', auth, getGroup1Users); // Fetch users in group 1
router.get('/group2', auth, getGroup2Users); // Fetch users in group 2
router.get('/group3', auth, getGroup3Users); // Fetch users in group 3

// Admin-only routes
router.delete('/users/:id', auth, adminAuth, deleteUser);  // Delete user (admin only)
router.post('/users/:id/role', auth, adminAuth, updateUserRole); // Update user role (admin only)
router.delete('/users/:id', auth, adminAuth, deleteUser);  // Delete user (admin only)

module.exports = router;
