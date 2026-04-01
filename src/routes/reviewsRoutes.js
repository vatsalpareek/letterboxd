const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const authMiddleware = require('../middleware/authMiddleware');

//Public: anyone can read review
router.get('/song/:songId', reviewsController.getSongReviews);

//Private: must be logged in to create/edit/delete
router.post('/', authMiddleware, reviewsController.createReview);
router.put('/:id', authMiddleware, reviewsController.updateReview);
router.delete('/:id', authMiddleware, reviewsController.deleteReview);

module.exports = router;