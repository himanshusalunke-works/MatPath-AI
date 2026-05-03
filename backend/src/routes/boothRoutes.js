const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const logger = require('../config/logger');

router.get('/', async (req, res, next) => {
    try {
        const snapshot = await db.collection('booths').get();
        const booths = [];
        snapshot.forEach(doc => {
            booths.push(doc.data());
        });
        res.json({ booths });
    } catch (error) {
        logger.error('Error fetching booths:', error);
        next(error);
    }
});

module.exports = router;
