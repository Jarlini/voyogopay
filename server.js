const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this points to your MongoDB connection
const authRoutes = require('./routes/auth'); // Authentication routes
const tripRoutes = require('./routes/trip'); // Trip routes
const packageRoutes = require('./routes/packege'); // Package routes (fixed typo)
const userRoutes = require('./routes/auth'); // User routes (you may want to change this to its own route if needed)
const adminRoutes = require('./routes/Admin'); // Admin routes
const bookingRoutes = require('./routes/booking'); // Booking routes
const paymentRoutes = require('./routes/paymentRoutes'); // Payment routes
const User = require('./models/user'); // Model for users

require('dotenv').config();

const app = express();

// Connect to the Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/trip', tripRoutes); // Trip routes
app.use('/api/packages', packageRoutes); // Package routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/payments', paymentRoutes); // Payment routes

// Static files
app.use('/uploads', express.static('uploads'));

// Test Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Check if email is associated with a logged-in user
app.get('/api/users/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Admin Routes
app.get('/api/admin/orders', (req, res) => {
    // Add logic to return the orders
    res.json({ orders: [] });
});

app.get('/api/admin/packages', (req, res) => {
    // Logic to fetch packages
    res.json({ packages: [] }); // Replace with actual package data
});

// Route to handle PayHere notification
app.post('/payment/notify', (req, res) => {
    const paymentData = req.body;

    // Log or process the payment data
    console.log('Payment Notification Received:', paymentData);

    // Validate payment data (you may need to verify signatures or transaction IDs)
    // Update your database with the payment status
    if (paymentData.status === '2') {
        // Payment successful, update the order
        console.log('Payment successful:', paymentData);
        // Add your logic to update the database here
    } else {
        // Payment failed or pending, handle accordingly
        console.log('Payment not successful or pending:', paymentData);
    }

    // Respond with a 200 status to acknowledge receipt of the notification
    res.status(200).json({ message: 'Notification received' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
