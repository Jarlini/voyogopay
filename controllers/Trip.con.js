// controllers/tripController.js
const Trip = require('../models/Trip');

// Add a new trip
exports.addTrip = async (req, res) => {
  const { name, details, location, duration } = req.body;

  try {
    const newTrip = new Trip({ name, details, location, duration });
    await newTrip.save();
    res.json({ message: 'Trip added successfully', trip: newTrip });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get trip by ID
exports.getTripById = async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  const { id } = req.params;
  const { name, details, location, duration } = req.body;

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.name = name || trip.name;
    trip.details = details || trip.details;
    trip.location = location || trip.location;
    trip.duration = duration || trip.duration;

    await trip.save();
    res.json({ message: 'Trip updated successfully', trip });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await Trip.findByIdAndDelete(id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
