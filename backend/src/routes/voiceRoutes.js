const express = require('express');
const router = express.Router();
const multer = require('multer');
const voiceController = require('../controllers/voiceController');

const upload = multer({ storage: multer.memoryStorage() });

// POST /v1/voice/tts
router.post('/tts', voiceController.textToSpeech);

// POST /v1/voice/stt
router.post('/stt', upload.single('audio'), voiceController.speechToText);

module.exports = router;
