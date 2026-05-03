const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const logger = require('../config/logger');

router.get('/', async (req, res, next) => {
    try {
        const doc = await db.collection('systemData').doc('locations').get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Location data not found' });
        }
        res.json({ states: doc.data().states });
    } catch (error) {
        logger.error('Error fetching locations:', error);
        next(error);
    }
});

module.exports = router;
