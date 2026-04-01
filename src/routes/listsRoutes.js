const express = require('express');
const router = express.Router();
const listsController = require('../controllers/listsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: Anyone can see a public list
router.get('/:id', listsController.getList);

// Private: Requires login to create/edit/delete
router.post('/', authMiddleware, listsController.createList);
router.post('/:id/songs', authMiddleware, listsController.addSongToList);
router.delete('/:id', authMiddleware, listsController.deleteList);

module.exports = router;
