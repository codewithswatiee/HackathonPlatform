const Organizer = require('../../models/organizer');
const bcrypt = require('bcryptjs');

// Validation function for organizer registration
const validateOrganizerData = (data) => {
    const requiredFields = [
        'name',
        'email',
        'password',
        'organizationType',
        'organizationName',
        'description'
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

    // Validate organization type
    const validOrganizationTypes = ['company', 'college', 'committee', 'other'];
    if (!validOrganizationTypes.includes(data.organizationType)) {
        throw new Error('Invalid organization type');
    }

    const profilePictureRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (data.profilePicture && !profilePictureRegex.test(data.profilePicture)) {
        throw new Error('Invalid profile picture URL');
    }
};

// Register a new organizer
const registerOrganizer = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            organizationType,
            organizationName,
            description,
            profilePicture
        } = req.body;

        // Validate input data
        validateOrganizerData(req.body);

        // Check if organizer already exists
        const existingOrganizer = await Organizer.findOne({ email });
        if (existingOrganizer) {
            return res.status(400).json({ 
                success: false,
                message: 'Organizer already exists',
                error: 'DUPLICATE_EMAIL'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new organizer
        const newOrganizer = new Organizer({
            name,
            email,
            password: hashedPassword,
            organizationType,
            organizationName,
            description,
            profilePicture
        });

        // Save organizer
        await newOrganizer.save();

        // Remove password from response
        const organizerResponse = newOrganizer.toObject();
        delete organizerResponse.password;

        res.status(201).json({
            success: true,
            message: 'Organizer registered successfully',
        });
    } catch (error) {
        console.error('Error in registerOrganizer:', error);
        
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
            message: 'Error registering organizer',
            error: error.message 
        });
    }
};

// Get all organizers
const getAllOrganizers = async (req, res) => {
    try {
        const organizers = await Organizer.find().select('-password');
        if (!organizers || organizers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No organizers found',
                error: 'NO_ORGANIZERS'
            });
        }
        res.status(200).json({
            success: true,
            count: organizers.length,
            organizers
        });
    } catch (error) {
        console.error('Error in getAllOrganizers:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching organizers',
            error: error.message 
        });
    }
};

// Get organizer by ID
const getOrganizerById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Organizer ID is required',
                error: 'MISSING_ID'
            });
        }

        const organizer = await Organizer.findById(req.params.id).select('-password');
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            organizer
        });
    } catch (error) {
        console.error('Error in getOrganizerById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid organizer ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error fetching organizer',
            error: error.message 
        });
    }
};

// Update organizer
const updateOrganizer = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Organizer ID is required',
                error: 'MISSING_ID'
            });
        }

        const updates = req.body;
        
        // Validate updates if they include required fields
        if (Object.keys(updates).length > 0) {
            validateOrganizerData({ ...updates, ...req.params });
        }

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const organizer = await Organizer.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
                error: 'NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Organizer updated successfully',
            organizer
        });
    } catch (error) {
        console.error('Error in updateOrganizer:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid organizer ID format',
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
            message: 'Error updating organizer',
            error: error.message 
        });
    }
};

// Delete organizer
const deleteOrganizer = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Organizer ID is required',
                error: 'MISSING_ID'
            });
        }

        const organizer = await Organizer.findByIdAndDelete(req.params.id);
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: 'Organizer not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Organizer deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteOrganizer:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid organizer ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error deleting organizer',
            error: error.message 
        });
    }
};

module.exports = {
    registerOrganizer,
    getAllOrganizers,
    getOrganizerById,
    updateOrganizer,
    deleteOrganizer
}; 