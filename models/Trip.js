const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1 // Assuming a trip should last at least 1 day
  },
  schedule: {
    type: String,
    required: true
  },
  photos: {
    type: [String], // Array of strings for photo paths
    required: true,
    validate: [arrayLimit, 'Exceeds the limit of photos']
  }
});

// Custom validator to limit the number of photos
function arrayLimit(val) {
  return val.length <= 10; // Limit to a maximum of 10 photos
}

module.exports = mongoose.model('Trip', tripSchema);
