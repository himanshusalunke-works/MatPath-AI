const express = require('express');
const router = express.Router();

const MILESTONES = [
  { label: 'Voter Registration Opens', date: '2026-04-01', passed: true },
  { label: 'Model Code of Conduct', date: '2026-04-20', passed: true },
  { label: 'Last day for voter list corrections', date: '2026-05-10', passed: false },
  { label: 'Campaign End', date: '2026-05-20', passed: false },
  { label: 'Voting Day 🗳️', date: '2026-05-22', passed: false },
  { label: 'Result Declaration', date: '2026-05-25', passed: false },
];

router.get('/', (req, res) => {
    res.json(MILESTONES);
});

module.exports = router;
