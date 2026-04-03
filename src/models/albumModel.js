const db = require('../config/db');

const albumModel = {
    // 1. Find album by external ID and platform
    findByExternalId: async (externalId, platform) => {
        const result = await db.query(
            'SELECT * FROM albums WHERE external_id = $1 AND source_platform = $2',
            [externalId, platform]
        );
        return result.rows[0];
    },
    
    // 2. Insert a new album or UPDATE if conflict
    create: async (albumData) => {
        const { external_id, source_platform, title, artist, artist_id, cover_url, release_date, track_count } = albumData;
        const result = await db.query(
            `INSERT INTO albums (external_id, source_platform, title, artist, artist_id, cover_url, release_date, track_count) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             ON CONFLICT (external_id, source_platform) 
             DO UPDATE SET 
                artist_id = EXCLUDED.artist_id,
                track_count = EXCLUDED.track_count,
                cover_url = EXCLUDED.cover_url,
                release_date = EXCLUDED.release_date
             RETURNING *`,
            [external_id, source_platform, title, artist, artist_id, cover_url, release_date, track_count]
        );
        return result.rows[0];
    },

    // 3. Find album by its internal database ID
    findById: async (id) => {
        const result = await db.query('SELECT * FROM albums WHERE id = $1', [id]);
        return result.rows[0];
    }
};

module.exports = albumModel;
