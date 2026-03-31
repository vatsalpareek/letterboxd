const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    //1. look for token in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            error: 'Access denied. No token provided.'
        });
    }
    //2. extract the token ignore the word 'Bearer'
    const token = authHeader.split(' ')[1];
    try {
        //3. Verify the token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //4. Attach the decoded user data to request object
        req.user = decoded;
        //5. Tell express to move on to next function(controller)
        next();
    } catch (error) {
        //if token is fake/expired, block
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

module.exports = verifyToken;