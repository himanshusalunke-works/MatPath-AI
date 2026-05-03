require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const boothRoutes = require('./routes/boothRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/workflow', workflowRoutes);
app.use('/v1/chat', chatRoutes);
app.use('/v1/voice', voiceRoutes);
app.use('/v1/booth', boothRoutes);
app.use('/v1/timeline', timelineRoutes);
app.use('/v1/locations', locationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
