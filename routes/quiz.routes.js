


const express = require('express');
const { addQuiz, getQuizzes, submitQuiz } = require('../controller/quiz.controller');
const router = express.Router();

// Create a new quiz
// router.post('/',addQuiz);
router.route('/').post(addQuiz)

// Get all quizzes
router.route('/').get(getQuizzes)

router.route('/:quizId').post(submitQuiz);

module.exports = router;




