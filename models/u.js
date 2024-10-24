// backend/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    groups: [String],
});

module.exports = mongoose.model('Useres', userSchema);
