const db = require('../config/db');

const songModel = {
    // 1. Find song by external ID and platform
    findByExternalId: async (externalId, platform) => {
        const result = await db.query(
            'SELECT * FROM songs WHERE external_id = $1 AND source_platform = $2',
            [externalId, platform]
        );
        return result.rows[0];
    },
    
    // 2. Insert a new song or get existing if conflict
    create: async (songData) => {
        const { external_id, source_platform, title, artist, album_name, cover_url, duration_ms } = songData;
        const result = await db.query(
            `INSERT INTO songs (external_id, source_platform, title, artist, album_name, cover_url, duration_ms) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             ON CONFLICT (external_id, source_platform) DO NOTHING
             RETURNING *`,
            [external_id, source_platform, title, artist, album_name, cover_url, duration_ms]
        );
        return result.rows[0];
    },

    // 3. Get cached song by database ID
    findById: async (id) => {
        const result = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
        return result.rows[0];
    }
};

module.exports = songModel;
