const { auth } = require('../config/firebase');
const logger = require('../config/logger');

const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        if (process.env.NODE_ENV === 'development' && idToken === 'mock-token') {
            req.user = { uid: 'mock-uid-001', email: 'dev@example.com' };
            return next();
        }
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error('Auth Middleware Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = { verifyToken };
