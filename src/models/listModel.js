const db = require('../config/db');

const listModel = {
    // Create a new empty list
    create: async (userId, title, description) => {
        const query = 'INSERT INTO lists (user_id, title, description) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await db.query(query, [userId, title, description]);
        return rows[0];
    },

    // Find a single list by its ID
    findById: async (id) => {
        const query = 'SELECT * FROM lists WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    // Get all lists created by a specific user
    findByUserId: async (userId) => {
        const query = 'SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC';
        const { rows } = await db.query(query, [userId]);
        return rows;
    },

    // Delete a list
    delete: async (id) => {
        const query = 'DELETE FROM lists WHERE id = $1';
        await db.query(query, [id]);
        return true;
    },

    // --- List Items (Songs inside lists) ---

    // Add a song to a list
    addSongToList: async (listId, songId, position) => {
        const query = 'INSERT INTO list_items (list_id, song_id, position) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await db.query(query, [listId, songId, position]);
        return rows[0];
    },

    // Remove a song from a list
    removeSongFromList: async (listId, songId) => {
        const query = 'DELETE FROM list_items WHERE list_id = $1 AND song_id = $2';
        await db.query(query, [listId, songId]);
        return true;
    },

    // Get all songs currently in a list (joins with the songs table for details)
    getSongsInList: async (listId) => {
        const query = `
            SELECT s.*, li.position 
            FROM songs s
            JOIN list_items li ON s.id = li.song_id
            WHERE li.list_id = $1
            ORDER BY li.position ASC
        `;
        const { rows } = await db.query(query, [listId]);
        return rows;
    }
};

module.exports = listModel;
