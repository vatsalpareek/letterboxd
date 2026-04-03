const axios = require('axios');

const appleService = {
    // Search iTunes for everything
    searchAll: async (query) => {
        try {
            const safeQuery = encodeURIComponent(query);
            const url = `https://itunes.apple.com/search?term=${safeQuery}&entity=song,album,musicArtist&limit=20`;
            
            const response = await axios.get(url);
            const data = response.data;
            if (!data.results) return [];

            return data.results.map((item) => {
                if (item.wrapperType === 'track') {
                    return {
                        type: 'song',
                        id: item.trackId.toString(),
                        title: item.trackName,
                        artist: item.artistName,
                        artistId: item.artistId.toString(),
                        album: item.collectionName,
                        albumId: item.collectionId.toString(),
                        cover_url: item.artworkUrl100,
                        duration_ms: item.trackTimeMillis,
                        release_date: item.releaseDate
                    };
                } else if (item.wrapperType === 'collection') {
                    return {
                        type: 'album',
                        id: item.collectionId.toString(),
                        title: item.collectionName,
                        artist: item.artistName,
                        artistId: item.artistId.toString(),
                        cover_url: item.artworkUrl100,
                        trackCount: item.trackCount,
                        release_date: item.releaseDate
                    };
                } else if (item.wrapperType === 'artist') {
                    return {
                        type: 'artist',
                        id: item.artistId.toString(),
                        title: item.artistName,
                        genre: item.primaryGenreName
                    };
                }
                return null;
            }).filter(item => item !== null);
        } catch (error) {
            console.error('Error searching Apple:', error);
            return [];
        }
    },

    // Fetch FULL discography (up to 200 albums)
    getArtistDiscography: async (artistId) => {
        try {
            const url = `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=200`;
            const response = await axios.get(url);
            const data = response.data;
            
            return data.results
                .filter(item => item.wrapperType === 'collection')
                .map(album => ({
                    id: album.collectionId.toString(),
                    title: album.collectionName,
                    artist: album.artistName,
                    artistId: album.artistId.toString(),
                    cover_url: album.artworkUrl100,
                    release_date: album.releaseDate,
                    year: album.releaseDate?.split('-')[0],
                    trackCount: album.trackCount
                }));
        } catch (error) {
            console.error('Error fetching discography:', error);
            return [];
        }
    },

    // Get all songs in an album
    getAlbumTracks: async (albumId) => {
        try {
            const url = `https://itunes.apple.com/lookup?id=${albumId}&entity=song&limit=200`;
            const response = await axios.get(url);
            const data = response.data;
            
            return data.results
                .filter(item => item.wrapperType === 'track')
                .map(song => ({
                    id: song.trackId.toString(),
                    title: song.trackName,
                    artist: song.artistName,
                    artistId: song.artistId.toString(),
                    albumId: song.collectionId.toString(),
                    cover_url: song.artworkUrl100,
                    duration_ms: song.trackTimeMillis,
                    release_date: song.releaseDate
                }));
        } catch (error) {
            console.error('Error fetching tracks:', error);
            return [];
        }
    }
};

module.exports = appleService;
