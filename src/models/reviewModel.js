const db = require('../config/db');

const reviewModel = {
    // Check if user already reviewed this exact song
    findByUserAndSong: async (userId, songId) => {
        const result = await db.query(
            'SELECT * FROM reviews WHERE user_id = $1 AND song_id = $2',
            [userId, songId]
        );
        return result.rows[0];
    },

    // Create a new review for a song
    create: async (userId, songId, rating, body) => {
        const result = await db.query(
            'INSERT INTO reviews (user_id, song_id, rating, body) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, songId, rating, body]
        );
        return result.rows[0];
    },

    // Get all reviews for a specific song (with usernames JOINED!)
    findBySongId: async (songId) => {
        const result = await db.query(`
            SELECT reviews.*, users.username 
            FROM reviews 
            JOIN users ON reviews.user_id = users.id 
            WHERE song_id = $1 
            ORDER BY created_at DESC
        `, [songId]);
        return result.rows;
    },

    // Find a specific review by its own ID (useful for edit/delete)
    findById: async (id) => {
        const result = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
        return result.rows[0];
    },

    // Update an existing review
    update: async (id, rating, body) => {
        const result = await db.query(
            'UPDATE reviews SET rating = $1, body = $2 WHERE id = $3 RETURNING *',
            [rating, body, id]
        );
        return result.rows[0];
    },

    // Delete a review
    delete: async (id) => {
        await db.query('DELETE FROM reviews WHERE id = $1', [id]);
    },

    // Get all reviews written by a specific user
    findByUserId: async (userId) => {
        const query = `
            SELECT reviews.*, songs.title as song_title 
            FROM reviews 
            JOIN songs ON reviews.song_id = songs.id 
            WHERE reviews.user_id = $1 
            ORDER BY reviews.created_at DESC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    },


    // Get average rating for a specific song
    getAverageRatingBySongId: async (songId) => {
        const result = await db.query(
            'SELECT ROUND(AVG(rating), 1) as "averageRating" FROM reviews WHERE song_id = $1',
            [songId]
        );
        return result.rows[0];
    }
};

module.exports = reviewModel;
