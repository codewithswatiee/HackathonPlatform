const HackathonTimeline = require('../../models/hackathonTimeline');
const Hackathon = require('../../models/hackathon');

// Validation function for timeline event
const validateTimelineEvent = (event) => {
    const requiredFields = [
        'title',
        'description',
        'startTime',
        'endTime',
        'type',
        'location'
    ];

    const missingFields = requiredFields.filter(field => !event[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate event times
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (startTime >= endTime) {
        throw new Error('Event end time must be after start time');
    }

    // Validate location
    if (event.location.type === 'offline' && !event.location.venue) {
        throw new Error('Venue is required for offline events');
    }
    if (event.location.type === 'online' && !event.location.onlinePlatform) {
        throw new Error('Online platform is required for online events');
    }
};

// Create a new timeline for a hackathon
const createTimeline = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const { timezone, events } = req.body;

        // Check if hackathon exists
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found',
                error: 'NOT_FOUND'
            });
        }

        // Check if timeline already exists
        const existingTimeline = await HackathonTimeline.findOne({ hackathonId });
        if (existingTimeline) {
            return res.status(400).json({
                success: false,
                message: 'Timeline already exists for this hackathon',
                error: 'DUPLICATE_TIMELINE'
            });
        }

        // Validate all events
        events.forEach(event => validateTimelineEvent(event));

        // Create new timeline
        const newTimeline = new HackathonTimeline({
            hackathonId,
            timezone,
            events
        });

        await newTimeline.save();

        res.status(201).json({
            success: true,
            message: 'Timeline created successfully',
            timeline: newTimeline
        });
    } catch (error) {
        console.error('Error in createTimeline:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating timeline',
            error: error.message
        });
    }
};

// Add an event to the timeline
const addEvent = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const newEvent = req.body;

        // Validate the new event
        validateTimelineEvent(newEvent);

        const timeline = await HackathonTimeline.findOne({ hackathonId });
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: 'Timeline not found',
                error: 'NOT_FOUND'
            });
        }

        // Add the new event
        timeline.events.push(newEvent);
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event added successfully',
            timeline
        });
    } catch (error) {
        console.error('Error in addEvent:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding event',
            error: error.message
        });
    }
};

// Update an event in the timeline
const updateEvent = async (req, res) => {
    try {
        const { hackathonId, eventId } = req.params;
        const updates = req.body;

        const timeline = await HackathonTimeline.findOne({ hackathonId });
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: 'Timeline not found',
                error: 'NOT_FOUND'
            });
        }

        const eventIndex = timeline.events.findIndex(event => event._id.toString() === eventId);
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
                error: 'NOT_FOUND'
            });
        }

        // Validate updates if they include required fields
        if (Object.keys(updates).length > 0) {
            validateTimelineEvent({ ...timeline.events[eventIndex].toObject(), ...updates });
        }

        // Update the event
        timeline.events[eventIndex] = {
            ...timeline.events[eventIndex].toObject(),
            ...updates
        };

        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            timeline
        });
    } catch (error) {
        console.error('Error in updateEvent:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};

// Delete an event from the timeline
const deleteEvent = async (req, res) => {
    try {
        const { hackathonId, eventId } = req.params;

        const timeline = await HackathonTimeline.findOne({ hackathonId });
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: 'Timeline not found',
                error: 'NOT_FOUND'
            });
        }

        const eventIndex = timeline.events.findIndex(event => event._id.toString() === eventId);
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
                error: 'NOT_FOUND'
            });
        }

        // Remove the event
        timeline.events.splice(eventIndex, 1);
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            timeline
        });
    } catch (error) {
        console.error('Error in deleteEvent:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
};

// Get timeline for a hackathon
const getTimeline = async (req, res) => {
    try {
        const { hackathonId } = req.params;

        const timeline = await HackathonTimeline.findOne({ hackathonId });
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: 'Timeline not found',
                error: 'NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            timeline
        });
    } catch (error) {
        console.error('Error in getTimeline:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching timeline',
            error: error.message
        });
    }
};

// Update event status
const updateEventStatus = async (req, res) => {
    try {
        const { hackathonId, eventId } = req.params;
        const { status } = req.body;

        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
                error: 'INVALID_STATUS'
            });
        }

        const timeline = await HackathonTimeline.findOne({ hackathonId });
        if (!timeline) {
            return res.status(404).json({
                success: false,
                message: 'Timeline not found',
                error: 'NOT_FOUND'
            });
        }

        const eventIndex = timeline.events.findIndex(event => event._id.toString() === eventId);
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
                error: 'NOT_FOUND'
            });
        }

        timeline.events[eventIndex].status = status;
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event status updated successfully',
            timeline
        });
    } catch (error) {
        console.error('Error in updateEventStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event status',
            error: error.message
        });
    }
};

module.exports = {
    createTimeline,
    addEvent,
    updateEvent,
    deleteEvent,
    getTimeline,
    updateEventStatus
}; 