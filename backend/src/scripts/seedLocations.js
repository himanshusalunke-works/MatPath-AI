const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { db } = require('../config/firebase');
const fs = require('fs');

async function seedLocations() {
    try {
        const jsonPath = path.resolve(__dirname, '../../../frontend/public/data/locations.json');
        
        if (!fs.existsSync(jsonPath)) {
            console.error('File not found:', jsonPath);
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        if (!data || !data.states) {
            console.error('Invalid locations data structure');
            process.exit(1);
        }

        await db.collection('systemData').doc('locations').set({
            states: data.states,
            updatedAt: new Date().toISOString()
        });

        console.log('Locations seeded to Firestore successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed locations:', error);
        process.exit(1);
    }
}

seedLocations();
