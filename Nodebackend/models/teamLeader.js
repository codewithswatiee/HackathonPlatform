const mongoose = require('mongoose');

const teamLeaderSchema = new mongoose.Schema({
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: true
    },
    teamCode: {
        type: String,
        unique: true,
        required: true
    },
    teamMembers: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Participant'
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    maxParticipants: {
        type: Number,
        default: 5 // Example: max 5 participants per team
    },
    minParticipants: {
        type: Number,
        default: 2 // Example: min 2 participants per team
    }
});

const TeamLeader = mongoose.model('TeamLeader', teamLeaderSchema);
module.exports = TeamLeader;