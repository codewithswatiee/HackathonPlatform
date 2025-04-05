const MentorJudge = require('../../models/mentorJudge');
const bcrypt = require('bcryptjs');

// Validation function for mentor/judge registration
const validateMentorJudgeData = (data) => {
    const requiredFields = [
        'name',
        'email',
        'password',
        'phone',
        'experience',
        'currentOrganization',
        'expertise',
        'isMentor',
        'isJudge'
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

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        throw new Error('Invalid phone number format');
    }

    // Validate expertise array
    if (!Array.isArray(data.expertise) || data.expertise.length === 0) {
        throw new Error('Expertise must be a non-empty array');
    }

    // Validate previous events if provided
    if (data.previousEvents) {
        if (!Array.isArray(data.previousEvents)) {
            throw new Error('Previous events must be an array');
        }
        data.previousEvents.forEach(event => {
            if (!event.eventName || !event.role || !event.year) {
                throw new Error('Each previous event must have eventName, role, and year');
            }
        });
    }

    // Validate at least one role is selected
    if (!data.isMentor && !data.isJudge) {
        throw new Error('At least one role (mentor or judge) must be selected');
    }
};

// Register a new mentor/judge
const registerMentorJudge = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            experience,
            currentOrganization,
            expertise,
            previousEvents,
            isMentor,
            isJudge
        } = req.body;

        // Validate input data
        validateMentorJudgeData(req.body);

        // Check if mentor/judge already exists
        const existingMentorJudge = await MentorJudge.findOne({ email });
        if (existingMentorJudge) {
            return res.status(400).json({ 
                success: false,
                message: 'Mentor/Judge already exists',
                error: 'DUPLICATE_EMAIL'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new mentor/judge
        const newMentorJudge = new MentorJudge({
            name,
            email,
            password: hashedPassword,
            phone,
            experience,
            currentOrganization,
            expertise,
            previousEvents,
            isMentor,
            isJudge
        });

        // Save mentor/judge
        await newMentorJudge.save();

        // Remove password from response
        const mentorJudgeResponse = newMentorJudge.toObject();
        delete mentorJudgeResponse.password;

        res.status(201).json({
            success: true,
            message: 'Mentor/Judge registered successfully',
            mentorJudge: mentorJudgeResponse
        });
    } catch (error) {
        console.error('Error in registerMentorJudge:', error);
        
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
            message: 'Error registering mentor/judge',
            error: error.message 
        });
    }
};

// Get all mentors/judges
const getAllMentorJudges = async (req, res) => {
    try {
        const mentorJudges = await MentorJudge.find().select('-password');
        if (!mentorJudges || mentorJudges.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No mentors/judges found',
                error: 'NO_MENTOR_JUDGES'
            });
        }
        res.status(200).json({
            success: true,
            count: mentorJudges.length,
            mentorJudges
        });
    } catch (error) {
        console.error('Error in getAllMentorJudges:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching mentors/judges',
            error: error.message 
        });
    }
};

// Get mentor/judge by ID
const getMentorJudgeById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Mentor/Judge ID is required',
                error: 'MISSING_ID'
            });
        }

        const mentorJudge = await MentorJudge.findById(req.params.id).select('-password');
        if (!mentorJudge) {
            return res.status(404).json({
                success: false,
                message: 'Mentor/Judge not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            mentorJudge
        });
    } catch (error) {
        console.error('Error in getMentorJudgeById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid mentor/judge ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error fetching mentor/judge',
            error: error.message 
        });
    }
};

// Update mentor/judge
const updateMentorJudge = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Mentor/Judge ID is required',
                error: 'MISSING_ID'
            });
        }

        const updates = req.body;
        
        // Validate updates if they include required fields
        if (Object.keys(updates).length > 0) {
            validateMentorJudgeData({ ...updates, ...req.params });
        }

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const mentorJudge = await MentorJudge.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!mentorJudge) {
            return res.status(404).json({
                success: false,
                message: 'Mentor/Judge not found',
                error: 'NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mentor/Judge updated successfully',
            mentorJudge
        });
    } catch (error) {
        console.error('Error in updateMentorJudge:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid mentor/judge ID format',
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
            message: 'Error updating mentor/judge',
            error: error.message 
        });
    }
};

// Delete mentor/judge
const deleteMentorJudge = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Mentor/Judge ID is required',
                error: 'MISSING_ID'
            });
        }

        const mentorJudge = await MentorJudge.findByIdAndDelete(req.params.id);
        if (!mentorJudge) {
            return res.status(404).json({
                success: false,
                message: 'Mentor/Judge not found',
                error: 'NOT_FOUND'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Mentor/Judge deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteMentorJudge:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid mentor/judge ID format',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Error deleting mentor/judge',
            error: error.message 
        });
    }
};

module.exports = {
    registerMentorJudge,
    getAllMentorJudges,
    getMentorJudgeById,
    updateMentorJudge,
    deleteMentorJudge
}; 