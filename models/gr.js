// models/Group.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Assuming you have a User model
    }
  ]
});

module.exports = mongoose.model('Group', GroupSchema);
