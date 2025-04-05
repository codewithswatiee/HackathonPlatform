const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
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
    phone: {
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
        default: 'participant'
    },
    // Participant specific fields
    age: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    githubLink: {
        type: String,
        required: true
    },
    linkedIn: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: function() { return this.isStudent; }
    },
    companyName: {
        type: String,
        required: function() { return !this.isStudent; }
    },
    isStudent: {
        type: Boolean,
        required: true
    }
});

// Index for faster queries
participantSchema.index({ email: 1 });

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant; 