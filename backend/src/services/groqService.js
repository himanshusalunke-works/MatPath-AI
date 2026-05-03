const { Groq } = require('groq-sdk');
const logger = require('../config/logger');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateChatResponse = async (messages, model = 'llama-3.3-70b-versatile', stream = true) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model,
            stream,
        });

        return chatCompletion;
    } catch (error) {
        logger.error('Groq Service Error:', error);
        throw error;
    }
};

module.exports = {
    generateChatResponse
};
