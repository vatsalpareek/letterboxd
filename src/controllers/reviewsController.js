const reviewModel = require('../models/reviewModel');
const songModel = require('../models/songModel');
const albumModel = require('../models/albumModel');

const reviewsController = {
    // GET /api/reviews (All recent)
    getAll: async (req, res) => {
        try {
            const reviews = await reviewModel.findAllJoined();
            res.json({ reviews });
        } catch (error) {
            console.error('All-time Feed Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // NEW: Get reviews by User ID
    getUserReviews: async (req, res) => {
        try {
            const userId = req.params.userId;
            const reviews = await reviewModel.findByUserId(userId);
            res.status(200).json({ reviews });
        } catch (error) {
            console.error('User Reviews Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // NEW: Check if user already reviewed a specific item
    checkUserReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { itemType, itemId } = req.params;
            let review = null;
            let internalId = itemId;

            // SMART LOOKUP: If itemId is an external ID, map it to our internal ID first
            if (itemType === 'song') {
                // Try to find if we already have this song in our DB
                const songByExt = await songModel.findByExternalId(itemId, 'apple');
                if (songByExt) internalId = songByExt.id;
                
                review = await reviewModel.findByUserAndSong(userId, internalId);
            } else {
                const albumByExt = await albumModel.findByExternalId(itemId, 'apple');
                if (albumByExt) internalId = albumByExt.id;

                review = await reviewModel.findByUserAndAlbum(userId, internalId);
            }
            
            res.status(200).json({ exists: !!review, review });
        } catch (error) {
            console.error('Check Review Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // POST /api/reviews
    createReview: async (req, res) => {
        try {
            const userId = req.user.id;
            const { song_id, album_id, rating, body } = req.body;

            if ((!song_id && !album_id) || rating === undefined) {
                return res.status(400).json({ error: 'song_id or album_id and rating are required.' });
            }

            if (song_id) {
                // Determine if it is external or internal ID
                let finalId = song_id;
                const songByExt = await songModel.findByExternalId(song_id, 'apple');
                if (songByExt) finalId = songByExt.id;

                const song = await songModel.findById(finalId);
                if (!song) return res.status(404).json({ error: 'Song not found in our database. Search for it first!' });
                
                const existingReview = await reviewModel.findByUserAndSong(userId, finalId);
                if (existingReview) return res.status(400).json({ error: 'You have already reviewed this song.' });

                const newReview = await reviewModel.create(userId, finalId, rating, body, 'song');
                return res.status(201).json({ message: 'Review created!', review: newReview });
            }

            if (album_id) {
                let finalId = album_id;
                const albumByExt = await albumModel.findByExternalId(album_id, 'apple');
                if (albumByExt) finalId = albumByExt.id;

                const album = await albumModel.findById(finalId);
                if (!album) return res.status(404).json({ error: 'Album not found in our database. Search for it first!' });
                
                const existingAlbumReview = await reviewModel.findByUserAndAlbum(userId, finalId);
                if (existingAlbumReview) return res.status(400).json({ error: 'You have already reviewed this album.' });

                const newReview = await reviewModel.create(userId, finalId, rating, body, 'album');
                return res.status(201).json({ message: 'Review created!', review: newReview });
            }
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
            res.status(200).json({ averageRating: averageResult.averageRating || 0, totalReviews: reviews.length, reviews });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // PUT /api/reviews/:id
    updateReview: async (req, res) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user.id;
            const { rating, body } = req.body;
            const review = await reviewModel.findById(reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.user_id !== userId) return res.status(403).json({ error: 'Forbidden: You can only edit your own reviews!' });
            const updatedReview = await reviewModel.update(reviewId, rating, body);
            res.status(200).json({ message: 'Review updated', review: updatedReview });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // DELETE /api/reviews/:id
    deleteReview: async (req, res) => {
        try {
            const reviewId = req.params.id;
            const userId = req.user.id;
            const review = await reviewModel.findById(reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.user_id !== userId) return res.status(403).json({ error: 'Forbidden: You can only delete your own reviews!' });
            await reviewModel.delete(reviewId);
            res.status(200).json({ message: 'Review deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = reviewsController;
