const appleService = require('../services/appleService');
const songModel = require('../models/songModel');
const albumModel = require('../models/albumModel');

const songsController = {
    // GET /api/songs/search?q=query
    search: async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) return res.status(400).json({ error: 'Query is required.' });

            const appleResults = await appleService.searchAll(query);
            const savedResults = [];

            for (const item of appleResults) {
                if (item.type === 'song') {
                    let saved = await songModel.create({
                        external_id: item.id,
                        source_platform: 'apple',
                        title: item.title,
                        artist: item.artist,
                        artist_id: item.artistId,
                        album_name: item.album || 'Unknown Album',
                        album_id: item.albumId,
                        cover_url: item.cover_url,
                        duration_ms: item.duration_ms,
                        release_date: item.release_date
                    });
                    if (saved) savedResults.push({ ...saved, type: 'song' });
                    
                } else if (item.type === 'album') {
                    let saved = await albumModel.create({
                        external_id: item.id,
                        source_platform: 'apple',
                        title: item.title,
                        artist: item.artist,
                        artist_id: item.artistId,
                        cover_url: item.cover_url,
                        release_date: item.release_date,
                        track_count: item.trackCount
                    });
                    if (saved) savedResults.push({ ...saved, type: 'album' });
                    
                } else {
                    savedResults.push(item);
                }
            }
            res.status(200).json({ results: savedResults });
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Search failed.' });
        }
    },

    // GET /api/songs/artist/:id
    getArtist: async (req, res) => {
        try {
            const artistId = req.params.id;
            const albumsRaw = await appleService.getArtistDiscography(artistId);
            
            const savedAlbums = [];
            for (const alb of albumsRaw) {
                let saved = await albumModel.create({
                    external_id: alb.id.toString(),
                    source_platform: 'apple',
                    title: alb.title,
                    artist: alb.artist,
                    artist_id: alb.artistId,
                    cover_url: alb.cover_url,
                    release_date: alb.release_date,
                    track_count: alb.trackCount
                });
                if (saved) savedAlbums.push({ ...saved, type: 'album' });
            }
            res.status(200).json({ albums: savedAlbums });
        } catch (error) {
            console.error('Artist lookup error:', error);
            res.status(500).json({ error: 'Artist lookup failed.' });
        }
    },

    // GET /api/songs/album/:id
    getAlbum: async (req, res) => {
        try {
            const albumId = req.params.id;
            const rawTracks = await appleService.getAlbumTracks(albumId);
            
            const savedTracks = [];
            for (const tk of rawTracks) {
                let saved = await songModel.create({
                    external_id: tk.id.toString(),
                    source_platform: 'apple',
                    title: tk.title,
                    artist: tk.artist,
                    artist_id: tk.artistId,
                    album_name: 'Unknown Album', 
                    album_id: tk.albumId,
                    cover_url: tk.cover_url,
                    duration_ms: tk.duration_ms,
                    release_date: tk.release_date
                });
                if (saved) savedTracks.push(saved);
            }
            res.status(200).json({ tracks: savedTracks });
        } catch (error) {
            console.error('Album lookup error:', error);
            res.status(500).json({ error: 'Album lookup failed.' });
        }
    },

    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const song = await songModel.findById(id);
            if (!song) return res.status(404).json({ error: 'Not found.' });
            res.status(200).json({ song });
        } catch (error) {
            res.status(500).json({ error: 'Fetch failed.' });
        }
    }
};

module.exports = songsController;
