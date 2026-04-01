const db = require('../config/db');

const userModel = {
    // 1. finding user via email
    findByEmail: async (email) => {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },
    // finding via username
    findByUsername: async (username) => {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    },
    // 2. inserting new user if sign up
    create: async (username, email, passwordHash) => {
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, passwordHash]
        );
        return result.rows[0];
    },
    // Find a user by their unique ID
    findById: async (id) => {
        const result = await db.query('SELECT id, username, email, bio, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },

    // Get counts of reviews and lists for a profile
    getUserStats: async (id) => {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM reviews WHERE user_id = $1) as review_count,
                (SELECT COUNT(*) FROM lists WHERE user_id = $1) as list_count
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = userModel;