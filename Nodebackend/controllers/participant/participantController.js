const Participant = require('../../models/participant');
const bcrypt = require('bcryptjs');

// Validation function for participant registration
const validateParticipantData = (data) => {
    const requiredFields = [
        'name',
        'username',
        'email',
        'password',
        'age',
        'experience',
        'skills',
        'githubLink',
        'linkedIn',
        'organization',
        'feildOfInterest',
        'bio',
        'city',
        'country',
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
    }

    // Validate age
    if (data.age < 13 || data.age > 100) {
        throw new Error('Age must be between 13 and 100');
    }

    // Validate GitHub and LinkedIn URLs
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(data.githubLink)) {
        throw new Error('Invalid GitHub URL');
    }
    if (!urlRegex.test(data.linkedIn)) {
        throw new Error('Invalid LinkedIn URL');
    }

    // Validate field of interest (array of strings)
    const validFieldsOfInterest = [
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
    ];
    if (!Array.isArray(data.feildOfInterest) || data.feildOfInterest.length === 0) {
        throw new Error('Field of interest must be a non-empty array');
    }
};

// Register a new participant
const registerParticipant = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
            phone,
            age,
            experience,
            skills,
            githubLink,
            linkedIn,
            organization,
            feildOfInterest,
            bio,
            city,
            country,
            resume
        } = req.body;

        console.log('Request body:', req.body);

        // Validate input data
        validateParticipantData(req.body);

        // Check if participant already exists
        const existingParticipant = await Participant.findOne({ email });
        if (existingParticipant) {
            return res.status(400).json({ 
                success: false,
                message: 'Participant already exists',
                error: 'DUPLICATE_EMAIL'
            });
        }

        // Check if username already exists
        const existingUsername = await Participant.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
                error: 'DUPLICATE_USERNAME'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new participant
        const newParticipant = new Participant({
            name,
            username,
            email,
            password: hashedPassword,
            phone,
            age,
            experience,
            skills,
            githubLink,
            linkedIn,
            organization,
            feildOfInterest,
            bio,
            city,
            country,
            resume
        });



        // Save participant
        await newParticipant.save();

        // Remove password from response
        const participantResponse = newParticipant.toObject();
        delete participantResponse.password;

        res.status(201).json({
            success: true,
            message: 'Participant registered successfully',
            participant: participantResponse
        });
    } catch (error) {
        console.error('Error in registerParticipant:', error);
        
        // Handle specific error types
        if (error.message.includes('Missing required fields')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'MISSING_FIELDS'
            });
        }
        
        if (error.message.includes('Invalid')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'INVALID_INPUT'
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Error registering participant',
            error: error.message 
        });
    }
};

// Get all participants
const getAllParticipants = async (req, res) => {
    try {
        const participants = await Participant.find().select('-password');
        if (!participants || participants.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No participants found',
                error: 'NO_PARTICIPANTS'
            });
        }
        res.status(200).json({
            success: true,
            count: participants.length,
            participants
        });
    } catch (error) {
        console.error('Error in getAllParticipants:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching participants',
            error: error.message 
        });
    }
};

// Get participant by ID
const getParticipantById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Participant ID is required',
                error: 'MISSING_ID'
            });
        }

        const participant = await Participant.findById(req.params.id).select('-password');
        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            participant
        });
    } catch (error) {
        console.error('Error in getParticipantById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid participant ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error fetching participant',
            error: error.message 
        });
    }
};

// Update participant
const updateParticipant = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Participant ID is required',
                error: 'MISSING_ID'
            });
        }

        const updates = req.body;
        
        // Validate updates if they include required fields
        if (Object.keys(updates).length > 0) {
            validateParticipantData({ ...updates, ...req.params });
        }

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const participant = await Participant.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
                error: 'NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Participant updated successfully',
            participant
        });
    } catch (error) {
        console.error('Error in updateParticipant:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid participant ID format',
                error: 'INVALID_ID'
            });
        }
        if (error.message.includes('Missing required fields') || error.message.includes('Invalid')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'VALIDATION_ERROR'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error updating participant',
            error: error.message 
        });
    }
};

// Delete participant
const deleteParticipant = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Participant ID is required',
                error: 'MISSING_ID'
            });
        }

        const participant = await Participant.findByIdAndDelete(req.params.id);
        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Participant deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteParticipant:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid participant ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error deleting participant',
            error: error.message 
        });
    }
};

module.exports = {
    registerParticipant,
    getAllParticipants,
    getParticipantById,
    updateParticipant,
    deleteParticipant
};