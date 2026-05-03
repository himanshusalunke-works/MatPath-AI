const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/verify', verifyToken, (req, res) => {
    res.json({
        uid: req.user.uid,
        email: req.user.email,
        email_verified: req.user.email_verified
    });
});

router.delete('/account', verifyToken, async (req, res) => {
    // In a real app, delete user from Firebase Auth and Firestore
    res.json({ message: 'Account deletion request received' });
});

module.exports = router;
