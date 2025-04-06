const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    // Common fields
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
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
    skills: {
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
    organization: {
        type: String,
        required: true
    },
    feildOfInterest:{
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Machine Learning',
            'AI',
            'Cyber Security',
            'Cloud Computing',
            'DevOps',
            'Blockchain',
            'Game Development'
        ],
        required: true
    },
    bio:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
    },
    resume: {
        type: String,
    },
    registeredHackathons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon'
    }],
});

// Index for faster queries
participantSchema.index({ email: 1 });

const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant; 