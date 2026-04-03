const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Search
router.get('/search', songsController.search);

// Artist Discography & Album Details
router.get('/artist/:id', songsController.getArtist);
router.get('/album/:id', songsController.getAlbum);

// Get by ID
router.get('/:id', songsController.getById);

module.exports = router;
