const listModel = require('../models/listModel');
const songModel = require('../models/songModel');

const listsController = {
    // POST /api/lists
    createList: async (req, res) => {
        try {
            const { title, description } = req.body;
            const userId = req.user.id; // From JWT middleware

            if (!title) {
                return res.status(400).json({ error: 'List title is required.' });
            }

            const newList = await listModel.create(userId, title, description);
            res.status(201).json({ message: 'List created successfully!', list: newList });

        } catch (error) {
            console.error('Error creating list:', error);
            res.status(500).json({ error: 'Internal server error while creating list' });
        }
    },

    // GET /api/lists/:id
    getList: async (req, res) => {
        try {
            const listId = req.params.id;

            // 1. Get the basic list details (title, user_id, etc.)
            const list = await listModel.findById(listId);
            if (!list) {
                return res.status(404).json({ error: 'List not found.' });
            }

            // 2. Fetch all songs that belong to this list
            const songs = await listModel.getSongsInList(listId);

            res.status(200).json({
                list: {
                    ...list,
                    songs: songs
                }
            });

        } catch (error) {
            console.error('Error fetching list:', error);
            res.status(500).json({ error: 'Internal server error fetching list details' });
        }
    },

    // POST /api/lists/:id/songs
    addSongToList: async (req, res) => {
        try {
            const listId = req.params.id;
            const { song_id, position } = req.body;
            const userId = req.user.id;

            // Step 1: Does the list exist?
            const list = await listModel.findById(listId);
            if (!list) return res.status(404).json({ error: 'List not found' });

            // Step 2: Does the user own it? (Security check)
            if (list.user_id !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only add songs to your own lists!' });
            }

            // Step 3: Does the song exist in our database?
            const song = await songModel.findById(song_id);
            if (!song) return res.status(404).json({ error: 'Song not found in our database. Search for it first!' });

            // Step 4: Add the song to the list_items table
            // If position is not provided, we just add it to the end (placeholder logic)
            const finalPosition = position || 1;
            const newItem = await listModel.addSongToList(listId, song_id, finalPosition);

            res.status(201).json({ message: 'Song added to list!', item: newItem });

        } catch (error) {
            console.error('Error adding song to list:', error);
            res.status(500).json({ error: 'Internal server error adding song to list' });
        }
    },

    // DELETE /api/lists/:id
    deleteList: async (req, res) => {
        try {
            const listId = req.params.id;
            const userId = req.user.id;

            const list = await listModel.findById(listId);
            if (!list) return res.status(404).json({ error: 'List not found' });

            if (list.user_id !== userId) {
                return res.status(403).json({ error: 'Forbidden: You can only delete your own lists!' });
            }

            await listModel.delete(listId);
            res.status(200).json({ message: 'List deleted successfully.' });

        } catch (error) {
            console.error('Error deleting list:', error);
            res.status(500).json({ error: 'Internal server error deleting list' });
        }
    }
};

module.exports = listsController;
