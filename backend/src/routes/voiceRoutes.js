const express = require('express');
const router = express.Router();
const multer = require('multer');
const voiceController = require('../controllers/voiceController');

const { verifyToken } = require('../middleware/authMiddleware');
const { createUserRateLimiter } = require('../middleware/rateLimiter');

const voiceLimiter = createUserRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // 5 voice actions per minute
    message: 'Voice processing limit reached. Please wait 1 minute.'
});

const upload = multer({ storage: multer.memoryStorage() });

// POST /v1/voice/tts
router.post('/tts', verifyToken, voiceLimiter, voiceController.textToSpeech);

// POST /v1/voice/stt
router.post('/stt', verifyToken, voiceLimiter, upload.single('audio'), voiceController.speechToText);

module.exports = router;
