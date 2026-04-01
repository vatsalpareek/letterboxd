const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');
const listModel = require('../models/listModel');

const usersController = {
    // GET /api/users/:id
    getPublicProfile: async (req, res) => {
        try {
            const userId = req.params.id;

            // 1. Get basic user info
            const user = await userModel.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // 2. Get their counts (reviews, lists)
            const stats = await userModel.getUserStats(userId);

            // 3. Get their latest 5 reviews
            const reviews = await reviewModel.findByUserId(userId);

            // 4. Get their lists
            const lists = await listModel.findByUserId(userId);

            res.status(200).json({
                user: { ...user, ...stats },
                recentReviews: reviews.slice(0, 5),
                lists: lists
            });

        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ error: 'Internal server error while fetching profile' });
        }
    },

    // GET /api/users/me (Private: your own profile)
    getMe: async (req, res) => {
        // Since we are using JWT, req.user already has our ID!
        res.status(200).json({
            message: "This is your private profile data",
            user: req.user
        });
    }
};

module.exports = usersController;
