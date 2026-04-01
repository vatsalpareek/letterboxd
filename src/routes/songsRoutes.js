const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');

//route to search songs via apple api
router.get('/search', songsController.search);

//route to get specific song by id
router.get('/:id', songsController.getById);

module.exports = router;