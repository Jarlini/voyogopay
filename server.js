const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this points to your MongoDB connection
const authRoutes = require('./routes/auth'); // Authentication routes
const packageRoutes = require('./routes/packege'); // Corrected the typo here
const userRoutes = require('./routes/auth'); // User routes (Ensure this is correct)
const adminRoutes = require('./routes/Admin'); // Admin routes
const bookingRoutes = require('./routes/booking'); // Booking routes
const paymentRoutes = require('./routes/paymentRoutes'); // Payment routes
const User = require('./models/user'); // Model for users
const Group = require('./models/gmodel'); // Group model
const Useres = require('./models/u'); // Model for another user if needed
const http = require('http');
const axios = require('axios'); // Ensure axios is included
require('dotenv').config(); // Load environment variables
const path = require('path');
const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server using the Express app
const tripRoutes = require('./routes/trip'); 
// Connect to the Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from frontend
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Initialize Socket.IO with the server and set CORS options
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from frontend
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});



// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/packages', packageRoutes); // Package routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/payments', paymentRoutes); // Payment routes

app.use('/api/admin', tripRoutes); // Use the trip routes
// Serve static files like images from the 'uploads' folder
app.use('/uploads', express.static('uploads'));




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

// Route to handle PayHere notifications
app.post('/payment/notify', (req, res) => {
    const paymentData = req.body;

    // Log or process the payment data
    console.log('Payment Notification Received:', paymentData);

    // Validate payment data and update database
    if (paymentData.status === '2') {
        console.log('Payment successful:', paymentData);
        // Update your database with the payment status here
    } else {
        console.log('Payment not successful or pending:', paymentData);
    }

    res.status(200).json({ message: 'Notification received' });
});

// Set up environment variables, like RapidAPI key
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Ensure you have this set in your .env file

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
