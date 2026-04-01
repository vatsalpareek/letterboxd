const reviewModel = require('../models/reviewModel');
const songModel = require('../models/songModel');

const reviewsController = {
    // POST /api/reviews
    createReview: async (req, res) => {
        try {
            // req.user safely comes from our JWT authMiddleware!
            const userId = req.user.id;
            const { song_id, rating, body } = req.body;

            if (!song_id || rating === undefined) {
                return res.status(400).json({ error: 'song_id and rating are required.' });
            }

            // Make sure the song actually exists in our DB organically
            const song = await songModel.findById(song_id);
            if (!song) {
                return res.status(404).json({ error: 'Song not found in our database. Search for it first!' });
            }

            // Enforce logic: Users can only have ONE review per song
            const existingReview = await reviewModel.findByUserAndSong(userId, song_id);
            if (existingReview) {
                return res.status(400).json({ error: 'You have already reviewed this song.' });
            }

            const newReview = await reviewModel.create(userId, song_id, rating, body);
            res.status(201).json({ message: 'Review created!', review: newReview });

        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // GET /api/reviews/song/:songId
    getSongReviews: async (req, res) => {
        try {
            const { songId } = req.params;

            const reviews = await reviewModel.findBySongId(songId);
            const averageResult = await reviewModel.getAverageRatingBySongId(songId);

            res.status(200).json({
                averageRating: averageResult.averageRating || 0,
                totalReviews: reviews.length,
                reviews
            });

        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // PUT /api/reviews/:id
    updateReview: async (req, res) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user.id; // From our JWT!
            const { rating, body } = req.body;

            const review = await reviewModel.findById(reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });

            // Security Check: Ensure the person editing actually owns the review!
            if (review.user_id !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only edit your own reviews!' });
            }

            const updatedReview = await reviewModel.update(reviewId, rating, body);
            res.status(200).json({ message: 'Review updated', review: updatedReview });

        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // DELETE /api/reviews/:id
    deleteReview: async (req, res) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user.id; // From our JWT!

            const review = await reviewModel.findById(reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });

            // Security Check: Match identity!
            if (review.user_id !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only delete your own reviews!' });
            }

            await reviewModel.delete(reviewId);
            res.status(200).json({ message: 'Review deleted successfully.' });

        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = reviewsController;
