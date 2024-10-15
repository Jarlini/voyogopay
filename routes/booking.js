const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
router.post('/booking', async (req, res) => {
  try {
      const newBooking = new Booking(req.body);
      const booking = await newBooking.save();
      res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
      console.error('Error saving booking:', error.message || error); // Log detailed error
      res.status(500).json({ message: 'Error saving booking', error: error.message });
  }
});



// GET: Fetch all bookings for admin
router.get('/orders', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('packages.packageId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;
