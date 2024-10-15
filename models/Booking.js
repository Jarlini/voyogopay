const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import Schema from mongoose

// Define the Passenger Schema (if not already defined elsewhere)
const passengerSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true }
});

// Define the Package Schema (if not already defined elsewhere)
const packageSchema = new Schema({
  packageId: { type: String, required: true },
  packageName: { type: String, required: false },
  packagePrice: { type: Number, required: true }
});

// Booking Schema
const bookingSchema = new Schema({
  email: {
    type: String,
    required: [false]
  },
  passengers: {
    type: [passengerSchema], // An array of passengers using the passenger schema
    required: true
  },
  numberOfPassengers: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Total Payment', 'Partial Payment'], // Define available payment options
    default: 'Total Payment'
  },
  packages: {
    type: [packageSchema], // An array of packages using the package schema
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
