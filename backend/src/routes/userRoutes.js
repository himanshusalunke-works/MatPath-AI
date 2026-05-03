const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { getUserProfile, updateUserProfile } = require('../services/firestoreService');
const { verifyToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

const profileSchema = Joi.object({
    age: Joi.number().min(18).max(120).optional(),
    state: Joi.string().required(),
    district: Joi.string().required(),
    voterStatus: Joi.string().valid('yes', 'no').required(),
    dob: Joi.string().isoDate().optional(),
    epicId: Joi.string().min(10).max(20).optional().allow(''),
    parliamentaryConstituency: Joi.string().optional().allow(''),
    assemblyConstituency: Joi.string().optional().allow('')
});

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

/**
 * Updates the user's profile information.
 * Validates the request body against the profileSchema.
 */
router.post('/profile', verifyToken, async (req, res) => {
    try {
        const { error, value } = profileSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: error.details.map(d => d.message) 
            });
        }

        let { age, dob } = value;

        // Calculate age from dob if missing
        if (!age && dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        await updateUserProfile(req.user.uid, {
            ...value,
            age: parseInt(age) || 0,
            updatedAt: new Date().toISOString()
        });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Profile Update Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
