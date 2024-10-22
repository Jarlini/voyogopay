const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this points to your MongoDB connection
const authRoutes = require('./routes/auth'); // Authentication routes
const tripRoutes = require('./routes/trip'); // Trip routes
const packageRoutes = require('./routes/packege'); // Corrected the typo here
const userRoutes = require('./routes/auth'); // Ensure this is the correct user routes
const adminRoutes = require('./routes/Admin'); // Admin routes
const bookingRoutes = require('./routes/booking'); // Booking routes
const paymentRoutes = require('./routes/paymentRoutes'); // Payment routes
const User = require('./models/user'); // Model for users
const http = require('http');
const axios = require('axios'); // Make sure to require axios
require('dotenv').config();

const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server using the Express app

// Connect to the Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Initialize Socket.IO with the server and set CORS options
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Joining a specific group
    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });

    // Listening for messages
    socket.on('sendMessage', (data) => {
        const { groupId, message, sender } = data;
        io.to(groupId).emit('receiveMessage', { message, sender });
    });

    socket.on('leaveGroup', (groupId) => {
        socket.leave(groupId);
        console.log(`User left group: ${groupId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

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

// Route to handle PayHere notification
app.post('/payment/notify', (req, res) => {
    const paymentData = req.body;

    // Log or process the payment data
    console.log('Payment Notification Received:', paymentData);

    // Validate payment data
    if (paymentData.status === '2') {
        console.log('Payment successful:', paymentData);
        // Update your database with the payment status
    } else {
        console.log('Payment not successful or pending:', paymentData);
    }

    res.status(200).json({ message: 'Notification received' });
});

// RapidAPI key should be stored in .env for security
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Ensure you have this set in your .env

// Route to create a new Telegram group
app.post('/api/createGroup', async (req, res) => {
    const { groupName, usernames } = req.body;

    try {
        const response = await axios.post('https://telegram124.p.rapidapi.com/api/createGroup', {
            groupName,
            usernames
        }, {
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': 'telegram124.p.rapidapi.com'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route to get bot info
app.get('/api/botInfo', async (req, res) => {
    const { username } = req.query;

    try {
        const response = await axios.get('https://telegram124.p.rapidapi.com/api/botInfo', {
            params: { username },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': 'telegram124.p.rapidapi.com'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching bot info:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
