const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/Trip'); 
// // Import controller functions
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
const verifyToken = require('./auth');  // Assuming your middleware file is auth.js

router.get('/users', verifyToken, async (req, res) => {
  // Only authenticated users can access this route
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a trip
router.put('/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, duration, price, description, images } = req.body;
  
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { name, location, duration, price, description, images },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip updated successfully', updatedTrip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Delete a trip
router.delete('/trips/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedTrip = await Trip.findByIdAndDelete(id);
    
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully', deletedTrip });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});
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
// Fetch all users for Admin
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // routes/admin.js
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
 
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete user with id: ${id}`); // Add this line
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

  // Fetch all trips for Home page
  router.get('/trips', async (req, res) => {
    try {
      const trips = await Trip.find();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.delete('/users/:id', auth, adminAuth, deleteUser);  // Delete user (admin only)

module.exports = router;
