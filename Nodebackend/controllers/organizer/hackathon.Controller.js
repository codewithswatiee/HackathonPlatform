const Hackathon = require('../../models/hackathon');
const Organizer = require('../../models/organizer');

// Validation function for hackathon data
const validateHackathonData = (data) => {
    const requiredFields = [
        'name',
        'description',
        'theme',
        'startDate',
        'endDate',
        'registrationStartDate',
        'registrationEndDate',
        'duration',
        'time',
        'location',
        'registrationFee',
        'prizePool',
        'domains',
        'maxTeamSize',
        'minTeamSize',
        'rules',
        'judgingCriteria'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate dates
    const registrationStartDate = new Date(data.registrationStartDate);
    const registrationEndDate = new Date(data.registrationEndDate);
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (registrationStartDate >= registrationEndDate) {
        throw new Error('Registration end date must be after registration start date');
    }
    if (registrationEndDate >= startDate) {
        throw new Error('Hackathon start date must be after registration end date');
    }
    if (startDate >= endDate) {
        throw new Error('Hackathon end date must be after start date');
    }

    // Validate location
    if (data.location.type === 'offline' && !data.location.venue) {
        throw new Error('Venue is required for offline hackathons');
    }
    if (data.location.type === 'online' && !data.location.onlinePlatform) {
        throw new Error('Online platform is required for online hackathons');
    }

    // Validate team sizes
    if (data.minTeamSize > data.maxTeamSize) {
        throw new Error('Minimum team size cannot be greater than maximum team size');
    }

    // Validate prize distribution
    if (data.prizeDistribution) {
        const totalPrize = data.prizeDistribution.reduce((sum, prize) => sum + prize.amount, 0);
        if (totalPrize > data.prizePool) {
            throw new Error('Total prize distribution cannot exceed prize pool');
        }
    }

    // Validate judging criteria weightage
    if (data.judgingCriteria) {
        const totalWeightage = data.judgingCriteria.reduce((sum, criteria) => sum + criteria.weightage, 0);
        if (totalWeightage !== 100) {
            throw new Error('Total weightage of judging criteria must equal 100');
        }
    }
};

// Create a new hackathon
const createHackathon = async (req, res) => {
    try {
        const { organizerId } = req.body; // Assuming user ID is available from auth middleware

        // Check if organizer exists
        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
                error: 'NOT_FOUND'
            });
        }

        // Validate hackathon data
        validateHackathonData(req.body);


        



        // Create new hackathon
        const newHackathon = new Hackathon({
            ...req.body,
            organizerId
        });

        // Save hackathon
        await newHackathon.save();

        res.status(201).json({
            success: true,
            message: 'Hackathon created successfully',
            hackathon: newHackathon
        });
    } catch (error) {
        console.error('Error in createHackathon:', error);
        
        // Handle specific error types
        if (error.message.includes('Missing required fields')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'MISSING_FIELDS'
            });
        }
        
        if (error.message.includes('Invalid') || error.message.includes('must be')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating hackathon',
            error: error.message
        });
    }
};

// Get all hackathons for an organizer
const getOrganizerHackathons = async (req, res) => {
    try {
        const {organizerId} = req.body;

        if (!organizerId) {
            return res.status(400).json({
                success: false,
                message: 'Organizer ID is required',
                error: 'MISSING_ORGANIZER_ID'
            });
        }

        console.log(organizerId);

        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
                error: 'ORGANIZER_NOT_FOUND'
            });
        }

        console.log(organizer);

        const hackathons = await Hackathon.find({ organizerId: organizer._id });
        if (!hackathons || hackathons.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No hackathons found',
                error: 'NO_HACKATHONS'
            });
        }

        res.status(200).json({
            success: true,
            count: hackathons.length,
            hackathons
        });
    } catch (error) {
        console.error('Error in getOrganizerHackathons:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hackathons',
            error: error.message
        });
    }
};

// Get a specific hackathon
const getHackathonById = async (req, res) => {  
    try {
        const hackathonId = req.params; // Assuming hackathon ID is passed as a URL parameter
        console.log(hackathonId.id);

        if (!hackathonId.id) {
            return res.status(400).json({
                success: false,
                message: 'Hackathon ID is required',
            })
        }

        const hackathon = await Hackathon.findById({_id: hackathonId.id});
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found',
                error: 'NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            hackathon
        });
    } catch (error) {
        console.error('Error in getHackathonById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid hackathon ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error fetching hackathon',
            error: error.message
        });
    }
};

// Update a hackathon
const updateHackathon = async (req, res) => {
    try {
        const {hackathonId} = req.body; 

        if (!hackathonId) {
            return res.status(400).json({
                success: false,
                message: 'Hackathon ID is required',
            })
        }
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found',
                error: 'NOT_FOUND'
            });
        }

        // Check if the organizer owns this hackathon
        if (hackathon.organizerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this hackathon',
                error: 'UNAUTHORIZED'
            });
        }

        // Validate updates if they include required fields
        if (Object.keys(req.body).length > 0) {
            validateHackathonData({ ...hackathon.toObject(), ...req.body });
        }

        // Update hackathon
        const updatedHackathon = await Hackathon.findByIdAndUpdate(
            hackathonId,
            { ...req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Hackathon updated successfully',
            hackathon: updatedHackathon
        });
    } catch (error) {
        console.error('Error in updateHackathon:', error);
        if (error.message.includes('Missing required fields') || error.message.includes('Invalid')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating hackathon',
            error: error.message
        });
    }
};

// Delete a hackathon
const deleteHackathon = async (req, res) => {
    try {
        const {hackathonId} = req.body;

        if (!hackathonId) {
            return res.status(400).json({
                success: false,
                message: 'Hackathon ID is required',
            })
        }
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                message: 'Hackathon not found',
                error: 'NOT_FOUND'
            });
        }

        // Check if the organizer owns this hackathon
        if (hackathon.organizerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this hackathon',
                error: 'UNAUTHORIZED'
            });
        }

        await Hackathon.findByIdAndDelete(hackathonId);

        res.status(200).json({
            success: true,
            message: 'Hackathon deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteHackathon:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid hackathon ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting hackathon',
            error: error.message
        });
    }
};

// Update hackathon status
const updateHackathonStatus = async (req, res) => {
    try {
        const { status, hackathonId, organizerId } = req.body;
        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
                error: 'INVALID_STATUS'
            });
        }

        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found',
                error: 'NOT_FOUND'
            });
        }

        // Check if the organizer owns this hackathon
        if (hackathon.organizerId.toString() !== organizerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this hackathon',
                error: 'UNAUTHORIZED'
            });
        }

        hackathon.status = status;
        await hackathon.save();

        res.status(200).json({
            success: true,
            message: 'Hackathon status updated successfully',
            hackathon
        });
    } catch (error) {
        console.error('Error in updateHackathonStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating hackathon status',
            error: error.message
        });
    }
};

// Get all hackathons
const getAllHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find();

        if (!hackathons || hackathons.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No hackathons found',
                error: 'NO_HACKATHONS'
            });
        }

        res.status(200).json({
            success: true,
            count: hackathons.length,
            hackathons
        });
    } catch (error) {
        console.error('Error in getAllHackathons:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hackathons',
            error: error.message
        });
    }
};

// Add the new function to the module exports
module.exports = {
    createHackathon,
    getOrganizerHackathons,
    getHackathonById,
    updateHackathon,
    deleteHackathon,
    updateHackathonStatus,
    getAllHackathons 
};


