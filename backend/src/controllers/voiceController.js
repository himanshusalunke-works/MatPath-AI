const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech');
const { Readable } = require('stream');

const ttsClient = new textToSpeech.TextToSpeechClient();
const sttClient = new speech.SpeechClient();

/**
 * Text to Speech controller
 */
exports.textToSpeech = async (req, res) => {
  try {
    const { text, languageCode = 'en-IN' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Map basic lang codes to Google neural voices
    const voiceMap = {
      'en-IN': { languageCode: 'en-IN', name: 'en-IN-Wavenet-B' },
      'hi-IN': { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A' },
      'mr-IN': { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A' },
      'ta-IN': { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' }
    };

    const voice = voiceMap[languageCode] || voiceMap['en-IN'];

    const request = {
      input: { text },
      voice: voice,
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.audioContent.length
    });
    
    res.send(response.audioContent);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
};

/**
 * Speech to Text controller
 */
exports.speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { languageCode = 'en-IN' } = req.body;
    const audioBytes = req.file.buffer.toString('base64');

    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: languageCode,
      },
    };

    const [response] = await sttClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({ text: transcription });
  } catch (error) {
    console.error('STT Error:', error);
    res.status(500).json({ error: 'Failed to recognize speech' });
  }
};
