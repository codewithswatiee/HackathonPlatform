const express = require('express');
const router = express.Router();

const { registerParticipant, getAllParticipants, getParticipantById, updateParticipant, deleteParticipant } = require('../controllers/participant/participantController');
const { participateInHackathon, fetchTeam } = require('../controllers/participant/hackathonParticipation');

router.post('/register', registerParticipant); // Register a new participant
router.get('/', getAllParticipants); // Get all participants
router.get('/:id', getParticipantById); // Get participant by ID
router.put('/:id', updateParticipant); // Update participant by ID
router.delete('/:id', deleteParticipant); // Delete participant by ID
router.post('/register-hackathon', participateInHackathon);
router.get('/fetch-team', fetchTeam)

module.exports = router;