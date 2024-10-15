// models/Trip.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  days: { type: Number, required: true },
  schedule: { type: String, required: true },
  photos: [String] // Array of photo URLs
});

const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
