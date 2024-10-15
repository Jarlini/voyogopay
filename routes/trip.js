const express = require('express');
const multer = require('multer');
const path = require('path');
const Trip = require('../models/Trip'); // Your Trip model
const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  }
});

const upload = multer({ storage: storage });

// Route to handle adding a new trip with image upload
router.post('/add', upload.single('image'), async (req, res) => {
  const { title, location, days, schedule } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // Simple validation checks
  if (!title || !location || !days || !schedule) {
    return res.status(400).json({ message: 'Please fill out all required fields.' });
  }

  try {
    const newTrip = new Trip({
      title,
      location,
      days,
      schedule,
      photos: image ? [image] : [] // Add image to the photos array
    });

    const savedTrip = await newTrip.save();
    res.status(201).json({ message: 'Trip added successfully!', trip: savedTrip });
  } catch (error) {
    console.error('Error in adding trip:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to handle updating a trip
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, location, days, schedule } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updatedTrip = await Trip.findById(id);
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Update fields
    updatedTrip.title = title || updatedTrip.title;
    updatedTrip.location = location || updatedTrip.location;
    updatedTrip.days = days || updatedTrip.days;
    updatedTrip.schedule = schedule || updatedTrip.schedule;
    if (image) {
      updatedTrip.photos = [image]; // Replace existing photos with the new image
    }

    const savedTrip = await updatedTrip.save();
    res.json({ message: 'Trip updated successfully!', trip: savedTrip });
  } catch (error) {
    console.error('Error in updating trip:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to handle deleting a trip
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTrip = await Trip.findByIdAndDelete(id);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully!' });
  } catch (error) {
    console.error('Error in deleting trip:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
