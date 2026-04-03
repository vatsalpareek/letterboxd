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

    // Check if user already reviewed this exact album
    findByUserAndAlbum: async (userId, albumId) => {
        const result = await db.query(
            'SELECT * FROM reviews WHERE user_id = $1 AND album_id = $2',
            [userId, albumId]
        );
        return result.rows[0];
    },

    // Create a new review (handles both song_id OR album_id)
    create: async (userId, itemId, rating, body, type = 'song') => {
        const column = type === 'song' ? 'song_id' : 'album_id';
        const query = `INSERT INTO reviews (user_id, ${column}, rating, body) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await db.query(query, [userId, itemId, rating, body]);
        return result.rows[0];
    },

    // All-time Feed (with JOINs for Songs AND Albums!)
    findAllJoined: async () => {
        const query = `
            SELECT 
                r.*, 
                u.username,
                COALESCE(s.title, a.title) as title,
                COALESCE(s.artist, a.artist) as artist,
                COALESCE(s.cover_url, a.cover_url) as cover_url,
                COALESCE(s.artist_id, a.artist_id) as artist_id,
                COALESCE(s.album_id, a.external_id) as external_id,
                COALESCE(s.album_name, a.title) as album_name,
                CASE WHEN r.song_id IS NOT NULL THEN 'song' ELSE 'album' END as item_type
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN songs s ON r.song_id = s.id
            LEFT JOIN albums a ON r.album_id = a.id
            ORDER BY r.created_at DESC
        `;
        const results = await db.query(query);
        return results.rows;
    },

    findBySongId: async (songId) => {
        const result = await db.query(`
            SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id 
            WHERE song_id = $1 ORDER BY created_at DESC
        `, [songId]);
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
        return result.rows[0];
    },

    update: async (id, rating, body) => {
        const result = await db.query(
            'UPDATE reviews SET rating = $1, body = $2 WHERE id = $3 RETURNING *',
            [rating, body, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM reviews WHERE id = $1', [id]);
    },

    findByUserId: async (userId) => {
        const query = `
            SELECT 
                r.*, 
                COALESCE(s.title, a.title) as title, 
                COALESCE(s.artist, a.artist) as artist,
                COALESCE(s.cover_url, a.cover_url) as cover_url,
                COALESCE(s.artist_id, a.artist_id) as artist_id,
                CASE WHEN r.song_id IS NOT NULL THEN 'song' ELSE 'album' END as item_type
            FROM reviews r
            LEFT JOIN songs s ON r.song_id = s.id
            LEFT JOIN albums a ON r.album_id = a.id
            WHERE r.user_id = $1 ORDER BY r.created_at DESC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    },

    getAverageRatingBySongId: async (songId) => {
        const result = await db.query('SELECT ROUND(AVG(rating), 1) as "averageRating" FROM reviews WHERE song_id = $1', [songId]);
        return result.rows[0];
    }
};

module.exports = reviewModel;
