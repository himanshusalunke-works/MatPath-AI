const express = require('express');
const router = express.Router();
const { getWorkflow, updateWorkflow } = require('../services/firestoreService');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const workflow = await getWorkflow(req.user.uid);
        if (!workflow) {
            return res.status(404).json({ error: 'Workflow not found' });
        }
        res.json(workflow);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/step', verifyToken, async (req, res) => {
    try {
        const { stepId, status } = req.body;
        // In a real app, logic to update specific step progress would go here
        await updateWorkflow(req.user.uid, { [`steps.${stepId}.status`]: status });
        res.json({ message: 'Step updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/generate', verifyToken, async (req, res) => {
    try {
        // Logic to generate workflow using Groq/AI would go here
        const mockWorkflow = {
            uid: req.user.uid,
            status: 'active',
            steps: {
                step1: { id: 'step1', title: 'Register to Vote', status: 'pending' },
                step2: { id: 'step2', title: 'Find your Booth', status: 'pending' },
                step3: { id: 'step3', title: 'Go Vote!', status: 'pending' }
            }
        };
        await updateWorkflow(req.user.uid, mockWorkflow);
        res.json(mockWorkflow);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
