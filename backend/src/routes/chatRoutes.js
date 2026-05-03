const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../services/groqService');
const { verifyToken } = require('../middleware/authMiddleware');
const { sanitizeInput } = require('../utils/sanitiser');
const logger = require('../config/logger');
const { createUserRateLimiter } = require('../middleware/rateLimiter');

const { getChatHistory, saveChatMessage, clearChatHistory } = require('../services/firestoreService');

const chatLimiter = createUserRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 messages per minute
    message: 'You are sending messages too quickly. Please wait a moment.'
});

/**
 * GET /v1/chat/history
 * Fetches the user's past conversation messages.
 */
router.get('/history', verifyToken, async (req, res) => {
    try {
        const history = await getChatHistory(req.user.uid);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

/**
 * DELETE /v1/chat/history
 * Clears the user's past conversation messages.
 */
router.delete('/history', verifyToken, async (req, res) => {
    try {
        await clearChatHistory(req.user.uid);
        res.json({ message: 'Chat history cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear chat history' });
    }
});

router.post('/', verifyToken, chatLimiter, async (req, res) => {
    const { message, history = [], userData = {} } = req.body;
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Save user message immediately
        await saveChatMessage(req.user.uid, { 
            role: 'user', 
            content: sanitizedMessage, 
            timestamp: new Date().toISOString() 
        });

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
        - Detect the language of the user's message and RESPOND IN THAT SAME LANGUAGE.
        - DO NOT greet the user in every message (e.g., avoid "Hello [Name]" or "Namaste"). Get straight to the information unless it is the very first message of a new conversation.
        - If the user asks about ANYTHING NOT RELATED to elections, politely inform them that you are specialized only in election guidance and cannot answer that.
        - Be neutral and non-partisan. Do not favor any political party.
        - Use professional tone and format responses with clean markdown.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: sanitizedMessage }
        ];

        const stream = await generateChatResponse(messages);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let fullContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullContent += content;
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }

        // Save AI response after stream completes
        if (fullContent) {
            await saveChatMessage(req.user.uid, { 
                role: 'assistant', 
                content: fullContent, 
                timestamp: new Date().toISOString() 
            });
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
