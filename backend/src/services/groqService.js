const { Groq } = require('groq-sdk');
const logger = require('../config/logger');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generates a chat completion response using the Groq AI SDK.
 * 
 * @param {Array<Object>} messages - The conversation history as an array of message objects.
 * @param {string} [model='llama-3.3-70b-versatile'] - The specific Groq model to use.
 * @param {boolean} [stream=true] - Whether to stream the response.
 * @returns {Promise<Object>} The chat completion result or stream.
 * @throws {Error} If the Groq API request fails.
 */
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
