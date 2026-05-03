const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../services/groqService');
const { verifyToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../utils/sanitiser');
const logger = require('../config/logger');

router.post('/', verifyToken, async (req, res) => {
    const { message, history = [], userData = {} } = req.body;
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const userName = userData.displayName || 'Voter';
        const systemPrompt = `You are MatPath AI, a professional and helpful Indian Election Guide. 
        The current user's name is ${userName}.
        Your ONLY purpose is to assist users with information related to:
        1. Voter registration and EPIC cards.
        2. Election dates, phases, and schedules in India.
        3. Polling booth location guidance.
        4. Understanding EVM, VVPAT, and voting procedures.
        5. Political awareness (neutral and non-partisan).
        6. Mandatory documents for voting.

        STRICT RULES:
        - Detect the language of the user's message and RESPOND IN THAT SAME LANGUAGE (e.g., if asked in Hindi, respond in Hindi; if in Marathi, respond in Marathi).
        - If the user asks about ANYTHING NOT RELATED to elections (e.g., cooking, programming, generic advice, non-election history), politely inform them that you are specialized only in election guidance and cannot answer that.
        - Be neutral and non-partisan. Do not favor any political party.
        - Use professional tone and format responses with clean markdown (bolding, lists, etc.) for high readability.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: sanitizedMessage }
        ];

        const stream = await generateChatResponse(messages);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        logger.error('Chat Route Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate chat response' });
        }
    }
});

module.exports = router;
