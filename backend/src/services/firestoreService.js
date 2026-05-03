const { db, auth } = require('../config/firebase');
const logger = require('../config/logger');

const USERS_COL = process.env.USERS_COLLECTION || 'users';
const WORKFLOWS_COL = process.env.WORKFLOWS_COLLECTION || 'workflows';
const CHATS_COL = process.env.CHATS_COLLECTION || 'chats';

const getUserProfile = async (uid) => {
    try {
        const doc = await db.collection(USERS_COL).doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        logger.error('Firestore getUserProfile error:', error);
        throw error;
    }
};

const updateUserProfile = async (uid, data) => {
    try {
        await db.collection(USERS_COL).doc(uid).set(data, { merge: true });
        return true;
    } catch (error) {
        logger.error('Firestore updateUserProfile error:', error);
        throw error;
    }
};

const getWorkflow = async (uid) => {
    try {
        const doc = await db.collection(WORKFLOWS_COL).doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        logger.error('Firestore getWorkflow error:', error);
        throw error;
    }
};

const updateWorkflow = async (uid, data) => {
    try {
        await db.collection(WORKFLOWS_COL).doc(uid).set(data, { merge: true });
        return true;
    } catch (error) {
        logger.error('Firestore updateWorkflow error:', error);
        throw error;
    }
};

const getChatHistory = async (uid) => {
    try {
        const doc = await db.collection(CHATS_COL).doc(uid).get();
        return doc.exists ? doc.data().messages || [] : [];
    } catch (error) {
        logger.error('Firestore getChatHistory error:', error);
        throw error;
    }
};

const saveChatMessage = async (uid, message) => {
    try {
        const chatRef = db.collection(CHATS_COL).doc(uid);
        const doc = await chatRef.get();
        
        if (!doc.exists) {
            await chatRef.set({ messages: [message] });
        } else {
            const currentMessages = doc.data().messages || [];
            // Keep only last 50 messages to prevent document size bloat
            const updatedMessages = [...currentMessages, message].slice(-50);
            await chatRef.update({ messages: updatedMessages });
        }
        return true;
    } catch (error) {
        logger.error('Firestore saveChatMessage error:', error);
        throw error;
    }
};

/** Seeding sample data for demonstration */
const seedSampleData = async () => {
    try {
        const demoEmail = 'user@example.com';
        const demoPassword = 'password123';
        let uid;

        // 1. Create/Get User in Firebase Auth
        try {
            const userRecord = await auth.getUserByEmail(demoEmail);
            uid = userRecord.uid;
            logger.info('Demo user already exists in Auth');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                const userRecord = await auth.createUser({
                    email: demoEmail,
                    password: demoPassword,
                    displayName: 'Ravi Kumar',
                });
                uid = userRecord.uid;
                logger.info('Created new demo user in Auth');
            } else {
                throw error;
            }
        }
        
        // 2. Seed Demo User Profile in Firestore
        await db.collection(USERS_COL).doc(uid).set({
            displayName: 'Ravi Kumar',
            email: demoEmail,
            age: 28,
            state: 'Maharashtra',
            district: 'Mumbai',
            isRegistered: true,
            createdAt: new Date().toISOString()
        });

        // 3. Seed Demo Workflow
        await db.collection(WORKFLOWS_COL).doc(uid).set({
            completedSteps: [1],
            currentStep: 2,
            updatedAt: new Date().toISOString(),
            steps: [
                { id: 1, title: 'Verify Voter Registration', status: 'completed' },
                { id: 2, title: 'Find Your Polling Booth', status: 'current' },
                { id: 3, title: 'Understand the EVM', status: 'pending' },
                { id: 4, title: 'Election Day Checklist', status: 'pending' }
            ]
        });

        // 4. Seed Sample AI Chat History
        await db.collection(CHATS_COL).doc(uid).set({
            messages: [
                { role: 'user', content: 'How do I find my booth?', timestamp: new Date().toISOString() },
                { role: 'assistant', content: 'You can find your polling booth by checking your EPIC number on the ECI portal or using our map tool!', timestamp: new Date().toISOString() }
            ]
        });

        logger.info('Sample database seeding successful for UID: ' + uid);
        return true;
    } catch (error) {
        logger.error('Firestore seeding error:', error);
        throw error;
    }
};

const clearChatHistory = async (uid) => {
    try {
        await db.collection(CHATS_COL).doc(uid).delete();
        return true;
    } catch (error) {
        logger.error('Firestore clearChatHistory error:', error);
        throw error;
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getWorkflow,
    updateWorkflow,
    getChatHistory,
    saveChatMessage,
    clearChatHistory,
    seedSampleData
};
