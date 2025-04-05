const express = require('express');
const router = express.Router();

const { registerParticipant, getAllParticipants, getParticipantById, updateParticipant, deleteParticipant } = require('../controllers/participant/participantController');

router.post('/register', registerParticipant); // Register a new participant
router.get('/', getAllParticipants); // Get all participants
router.get('/:id', getParticipantById); // Get participant by ID
router.put('/:id', updateParticipant); // Update participant by ID
router.delete('/:id', deleteParticipant); // Delete participant by ID

module.exports = router;