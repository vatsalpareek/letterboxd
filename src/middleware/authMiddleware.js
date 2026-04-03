const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('>>> 👤 API USER REQUEST IDENTIFIED:', decoded.id);
        req.user = decoded; // This has { id: userId }
        next();
    } catch (err) {
        console.error('❌ AUTH FAIL:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
