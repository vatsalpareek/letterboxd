const express = require('express');
const authController = require('../controllers/authController');

// This acts like a mini Express app just for handling route paths
const router = express.Router();

// When someone sends a POST request to '/signup', run our signup function!
router.post('/signup', authController.signup);

// (We will add the login route here later)

module.exports = router;
