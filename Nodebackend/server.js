const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const organizerRoutes = require('./routers/organiser.route.js');
const participantRoutes = require('./routers/participant.route.js');

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

app.use('/api/organizers', organizerRoutes);
app.use('/api/participant', participantRoutes);