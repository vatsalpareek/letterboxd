const express = require('express');
const authController = require('../controllers/authController');

// import bouncer
const verifyToken = require('../middleware/authMiddleware');

// This acts like a mini Express app just for handling route paths
const router = express.Router();

// When someone sends a POST request to '/signup', run our signup function!
router.post('/signup', authController.signup);
// ... under router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 2. NEW: Give the bouncer a door to guard!
// Notice how `verifyToken` sits right in the middle between the URL and the function
router.get('/test-vip-room', verifyToken, (req, res) => {
    // This code ONLY runs if verifyToken says they are allowed in
    res.json({
        message: 'Successfully entered the VIP room!',
        decrypted_user_info: req.user
    });
});

// (We will add the login route here later)

module.exports = router;
