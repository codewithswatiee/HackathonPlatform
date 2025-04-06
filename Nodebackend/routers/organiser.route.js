const express = require('express');
const router = express.Router();
const { registerOrganizer, getAllOrganizers, getOrganizerById, updateOrganizer, deleteOrganizer } = require('../controllers/organizer/organizerController');
const { createHackathon, getOrganizerHackathons, getAllHackathons, getHackathonById } = require('../controllers/organizer/hackathon.Controller');
// Register a new organizer
router.post('/register', registerOrganizer);
router.post('/create-hackathon', createHackathon);
router.get('/org-hackathons', getOrganizerHackathons);
router.get('/hackathons', getAllHackathons);
router.get("/hackathons/:id", getHackathonById); // Get organizer by ID


module.exports = router;