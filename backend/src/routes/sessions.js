const express = require('express');
const { createSession, getSessions, getSessionById, completeSession } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.patch('/:id/complete', completeSession);

module.exports = router;
