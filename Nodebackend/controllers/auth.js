const Participant = require('../models/participant.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
const TeamLeader = require('../models/teamLeader.js');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Find the user by email
        const user = await Participant.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET || 'your_jwt_secret', // Secret key
            { expiresIn: '3d' } // Token expiration (3 days)
        );

        console.log(user)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Return the token
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

module.exports = login;
