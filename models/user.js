const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
        unique: true
    },
    chatlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"
    }]
});

module.exports = mongoose.model('user', userSchema);