const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

// Private route: See your OWN details using JWT (Priority 1)
router.get('/me', authMiddleware, usersController.getMyFullProfile);

// Public route: See anyone's profile by their ID (Priority 2)
router.get('/:id', usersController.getPublicProfile);

module.exports = router;
