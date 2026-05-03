const admin = require('firebase-admin');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

let db, auth;

try {
    const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const serviceAccountPath = envPath ? path.resolve(process.cwd(), envPath) : null;
    
    if (admin.apps.length === 0) {
        if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
            // Local development with service account file
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
            logger.info('Firebase Admin initialized with service account file');
        } else {
            // Production / Cloud Run with Application Default Credentials
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
            logger.info('Firebase Admin initialized with Application Default Credentials');
        }
    }
} catch (error) {
    logger.error('Firebase initialization error:', error);
    
    // Mock mode fallback for local dev without any keys
    if (process.env.NODE_ENV !== 'production') {
        logger.warn('Running in Mock Mode due to initialization failure');
    }
}

db = admin.apps.length ? admin.firestore() : { 
    collection: () => ({ 
        doc: () => ({ 
            get: () => Promise.resolve({ exists: false, data: () => ({}) }),
            set: () => Promise.resolve(true),
            update: () => Promise.resolve(true)
        }) 
    }) 
};

auth = admin.apps.length ? admin.auth() : {
    verifyIdToken: (token) => token === 'mock-token' ? Promise.resolve({ uid: 'mock-uid-001', email: 'mock@example.com' }) : Promise.reject(new Error('Invalid token'))
};

module.exports = { admin, db, auth };
