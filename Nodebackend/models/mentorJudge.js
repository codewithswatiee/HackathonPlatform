const mongoose = require('mongoose');

const mentorJudgeSchema = new mongoose.Schema({
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
        default: 'mentor_judge'
    },
    // Mentor/Judge specific fields
    experience: {
        type: String,
        required: true
    },
    currentOrganization: {
        type: String,
        required: true
    },
    expertise: [{
        type: String,
        required: true
    }],
    previousEvents: [{
        eventName: String,
        role: String,
        year: Number
    }],
    isMentor: {
        type: Boolean,
        required: true
    },
    isJudge: {
        type: Boolean,
        required: true
    }
});

// Index for faster queries
mentorJudgeSchema.index({ email: 1 });

const MentorJudge = mongoose.model('MentorJudge', mentorJudgeSchema);
module.exports = MentorJudge; 