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

    // 2. Insert a new song or UPDATE if conflict (to sync new IDs)
    create: async (songData) => {
        const { external_id, source_platform, title, artist, artist_id, album_name, album_id, cover_url, duration_ms, release_date } = songData;
        const result = await db.query(
            `INSERT INTO songs (external_id, source_platform, title, artist, artist_id, album_name, album_id, cover_url, duration_ms, release_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             ON CONFLICT (external_id, source_platform) 
             DO UPDATE SET 
                artist_id = EXCLUDED.artist_id,
                album_id = EXCLUDED.album_id,
                cover_url = EXCLUDED.cover_url,
                release_date = EXCLUDED.release_date
             RETURNING *`,
            [external_id, source_platform, title, artist, artist_id, album_name, album_id, cover_url, duration_ms, release_date]
        );
        return result.rows[0];
    },

    // 3. Find song by its internal database ID
    findById: async (id) => {
        const result = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
        return result.rows[0];
    }
};

module.exports = songModel;
