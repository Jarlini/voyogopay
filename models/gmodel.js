// backend/groupModel.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    adminId: String,
    members: [String],
    messages: [
        {
            senderId: String,
            text: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('Group', groupSchema);
