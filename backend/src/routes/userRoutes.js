const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../services/firestoreService');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const profile = await getUserProfile(req.user.uid);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { age, state, district, voterStatus } = req.body;
        await updateUserProfile(req.user.uid, {
            age: parseInt(age),
            state,
            district,
            voterStatus,
            updatedAt: new Date().toISOString()
        });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Profile Update Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
