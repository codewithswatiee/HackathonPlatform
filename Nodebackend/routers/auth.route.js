const express = require('express');
const login = require('../controllers/auth');
const router = express.Router();
// Register a new organizer
router.post('/login', login)


module.exports = router;