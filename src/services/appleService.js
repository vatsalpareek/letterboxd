const appleService = {
    // Search iTunes for a song! No API keys required.
    searchSongs: async (query) => {
        try {
            // We format the text so it's URL-safe (e.g., "blinding lights" -> "blinding+lights")
            const safeQuery = encodeURIComponent(query);

            // Fetch from iTunes: entity=song guarantees we only get music tracks
            const url = `https://itunes.apple.com/search?term=${safeQuery}&entity=song&limit=10`;
            const response = await fetch(url);
            const data = await response.json();

            // Map Apple's weird data names into our clean database format
            const formattedSongs = data.results.map((track) => ({
                external_id: track.trackId.toString(),
                source_platform: 'apple',
                title: track.trackName,
                artist: track.artistName,
                album_name: track.collectionName,
                cover_url: track.artworkUrl100, // 100x100px album cover
                duration_ms: track.trackTimeMillis
            }));

            return formattedSongs;
        } catch (error) {
            console.error('Error fetching from Apple:', error.message);
            return [];
        }
    }
};

module.exports = appleService;
