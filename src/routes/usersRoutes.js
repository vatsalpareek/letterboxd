const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route: See anyone's profile
router.get('/:id', usersController.getPublicProfile);

// Private route: See your own details
router.get('/me', authMiddleware, usersController.getMe);

module.exports = router;
