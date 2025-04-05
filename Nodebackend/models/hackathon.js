const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    registrationStartDate: {
        type: Date,
        required: true
    },
    registrationEndDate: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    time: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    location: {
        type: {
            type: String,
            enum: ['online', 'offline'],
            required: true
        },
        venue: {
            type: String,
            required: function() {
                return this.location.type === 'offline';
            }
        },
    },
    registrationFee: {
        type: Number,
        required: true,
        min: 0
    },
    prizePool: {
        type: Number,
        required: true,
        min: 0
    },
    prizeDistribution: [{
        position: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    domains: [{
        type: String,
        required: true
    }],
    maxTeamSize: {
        type: Number,
        required: true,
        min: 1
    },
    minTeamSize: {
        type: Number,
        required: true,
        min: 1
    },
    rules: [{
        type: String,
        required: true
    }],
    judgingCriteria: [{
        criterion: {
            type: String,
            required: true
        },
        weightage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    bannerImage: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
hackathonSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Validate dates
hackathonSchema.pre('save', function(next) {
    if (this.registrationStartDate >= this.registrationEndDate) {
        throw new Error('Registration end date must be after registration start date');
    }
    if (this.registrationEndDate >= this.startDate) {
        throw new Error('Hackathon start date must be after registration end date');
    }
    if (this.startDate >= this.endDate) {
        throw new Error('Hackathon end date must be after start date');
    }
    next();
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

module.exports = Hackathon; 