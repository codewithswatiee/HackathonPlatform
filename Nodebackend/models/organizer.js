const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    // Common fields
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'organizer'
    },
    // Organizer specific fields
    organizationType: {
        type: String,
        enum: ['company', 'college', 'committee', 'other'],
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

// Index for faster queries
organizerSchema.index({ email: 1 });

const Organizer = mongoose.model('Organizer', organizerSchema);
module.exports = Organizer; 