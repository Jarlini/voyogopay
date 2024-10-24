const express = require('express');
const multer = require('multer');
const Trip = require('../models/Trip'); // Adjust the path to your Trip model
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Adjust the path where you want to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid name collisions
  }
});
const upload = multer({ storage });

// Create new trip
router.post('/trips', upload.array('photos'), async (req, res) => {
  try {
    const { title, location, days, schedule } = req.body;

    const trip = new Trip({
      title,
      location,
      days,
      schedule,
      photos: req.files.map(file => file.path) // Save uploaded file paths to the database
    });

    const savedTrip = await trip.save();
    res.status(201).json({ newTrip: savedTrip });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update trip
router.put('/trips/:id', upload.array('photos'), async (req, res) => {
  const { id } = req.params;
  const { title, location, days, schedule } = req.body;

  try {
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Update fields
    trip.title = title || trip.title;
    trip.location = location || trip.location;
    trip.days = days || trip.days;
    trip.schedule = schedule || trip.schedule;

    // Handle new photos (optional)
    if (req.files && req.files.length > 0) {
      trip.photos = [...trip.photos, ...req.files.map(file => file.path)]; // Append new photos
    }

    const updatedTrip = await trip.save();
    res.status(200).json({ updatedTrip });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/trips', async (req, res) => {
    try {
      const trips = await Trip.find();
      res.status(200).json(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

//   // Update trip
//   router.put('/trips/:id', upload.array('photos'), async (req, res) => {
//     // Your existing code
//   });
  
  // Delete trip
  router.delete('/trips/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const trip = await Trip.findByIdAndDelete(id);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

module.exports = router;
