const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const authMiddleware = require('../middleware/authMiddleware');

//Public: anyone can read review
router.get('/', reviewsController.getAll);
router.get('/song/:songId', reviewsController.getSongReviews);
router.get('/user/:userId', reviewsController.getUserReviews);

//Private: must be logged in to create/edit/delete
router.post('/', authMiddleware, reviewsController.createReview);
router.get('/check/:itemType/:itemId', authMiddleware, reviewsController.checkUserReview);
router.put('/:id', authMiddleware, reviewsController.updateReview);
router.delete('/:id', authMiddleware, reviewsController.deleteReview);

module.exports = router;
