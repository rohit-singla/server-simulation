const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    timestamp: {
        type: Number
    },
    isSent: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('chat', chatSchema);