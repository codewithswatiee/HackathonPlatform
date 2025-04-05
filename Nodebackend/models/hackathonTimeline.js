const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: [
            'registration',
            'opening',
            'workshop',
            'mentoring',
            'submission',
            'judging',
            'award',
            'closing',
            'break',
            'other'
        ],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['online', 'offline', 'both'],
            required: true
        },
        venue: {
            type: String,
            required: function() {
                return this.location.type === 'offline' || this.location.type === 'both';
            }
        },
        onlinePlatform: {
            type: String,
            required: function() {
                return this.location.type === 'online' || this.location.type === 'both';
            }
        }
    },
    speakers: [{
        name: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        organization: {
            type: String,
            required: true
        }
    }],
    resources: [{
        type: {
            type: String,
            enum: ['document', 'link', 'video', 'presentation'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    isMandatory: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
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

const hackathonTimelineSchema = new mongoose.Schema({
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    },
    events: [timelineEventSchema],
    timezone: {
        type: String,
        required: true,
        default: 'UTC'
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
hackathonTimelineSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Validate event times
timelineEventSchema.pre('save', function(next) {
    if (this.startTime >= this.endTime) {
        throw new Error('Event end time must be after start time');
    }
    next();
});

// Validate timeline events
hackathonTimelineSchema.pre('save', function(next) {
    // Sort events by start time
    this.events.sort((a, b) => a.startTime - b.startTime);
    
    // Check for overlapping events
    for (let i = 0; i < this.events.length - 1; i++) {
        if (this.events[i].endTime > this.events[i + 1].startTime) {
            throw new Error(`Events "${this.events[i].title}" and "${this.events[i + 1].title}" overlap`);
        }
    }
    next();
});

const HackathonTimeline = mongoose.model('HackathonTimeline', hackathonTimelineSchema);

module.exports = HackathonTimeline; 