const appleService = require('../services/appleService');
const songModel = require('../models/songModel');

const songsController = {
    // GET /api/songs/search?q=query
    search: async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ error: 'Search query is required. Usage: /api/songs/search?q=your_search' });
            }

            // 1. Search Apple API
            const results = await appleService.searchSongs(query);

            if (!results || results.length === 0) {
                return res.status(200).json({ message: 'No songs found.', songs: [] });
            }

            // 2. Cache the results in our database
            const savedSongs = [];
            for (const track of results) {
                // Try to save via our model
                let savedTrack = await songModel.create(track);
                
                // If the track already existed, create() returns undefined because of ON CONFLICT DO NOTHING
                // In that case, we can manually fetch it to get its local DB ID
                if (!savedTrack) {
                    savedTrack = await songModel.findByExternalId(track.external_id, track.source_platform);
                }
                
                if (savedTrack) {
                    savedSongs.push(savedTrack);
                }
            }

            // 3. Return the cached results complete with our internal database IDs
            res.status(200).json({ songs: savedSongs });

        } catch (error) {
            console.error('Error in songs search controller:', error);
            res.status(500).json({ error: 'Internal server error during search.' });
        }
    },

    // GET /api/songs/:id
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const song = await songModel.findById(id);

            if (!song) {
                return res.status(404).json({ error: 'Song not found in our database.' });
            }

            res.status(200).json({ song });
        } catch (error) {
            console.error('Error fetching song by ID:', error);
            res.status(500).json({ error: 'Internal server error fetching song.' });
        }
    }
};

module.exports = songsController;
