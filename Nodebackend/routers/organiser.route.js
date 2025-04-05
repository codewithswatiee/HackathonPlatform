const express = require('express');
const router = express.Router();
const { registerOrganizer, getAllOrganizers, getOrganizerById, updateOrganizer, deleteOrganizer } = require('../controllers/organizer/organizerController');
const { createHackathon, getOrganizerHackathons } = require('../controllers/organizer/hackathon.Controller');
// Register a new organizer
router.post('/register', registerOrganizer);
router.post('/create-hackathon', createHackathon);
router.get('/hackathons', getOrganizerHackathons);


module.exports = router;