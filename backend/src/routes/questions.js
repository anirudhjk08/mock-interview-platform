const express = require('express');
const { generateQuestion, submitAnswer } = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', generateQuestion);
router.post('/:id/answer', submitAnswer);

module.exports = router;
