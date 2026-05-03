const rateLimit = require('express-rate-limit');

/**
 * User-based rate limiter middleware.
 * Limits requests based on the Firebase UID (req.user.uid) rather than IP address.
 * 
 * @param {Object} options - Rate limit options (windowMs, max, message).
 */
const createUserRateLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // Default 15 mins
        max: options.max || 100, // Default 100 requests per window
        message: {
            error: options.message || 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        // The key generator uses the user's UID from the verified token
        keyGenerator: (req) => {
            return req.user ? req.user.uid : req.ip;
        },
        // Optional: Skip for non-authenticated users if needed, 
        // but here we expect verifyToken to have run already.
        skip: (req) => !req.user
    });
};

module.exports = {
    createUserRateLimiter
};
