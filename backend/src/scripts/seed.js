require('dotenv').config();
const { seedSampleData } = require('../services/firestoreService');
const logger = require('../config/logger');

const runSeed = async () => {
    try {
        console.log('Starting database seeding...');
        await seedSampleData();
        console.log('Database seeded successfully! You can now log in with user@example.com / password123');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

runSeed();
