const Quiz = require('../schema/quiz.schema')
const QuizSubmission=require('../schema/quiz.submission.schema')

exports.addQuiz = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.questions) {
      return res.status(400).json({ success: false, errors: 'Missing required fields', data: null });
    }
    const questions = req.body.questions;
    for (const question of questions) {
      if (!question.question || !question.choices || question.choices.length < 2 || question.answer === undefined) {
        return res.status(400).json({ success: false, errors: 'Invalid question format', data: null });
      }
    }
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, errors: null, data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: 'Internal server error', data: null });
  }
}

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json({ success: true, errors: null, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Internal server error', data: null });
  }
}

exports.submitQuiz = async (req, res) => {
  // Submit answers to a quiz
  try {
    const quizId = req.params?.quizId;
    console.log(quizId);
    if (!quizId) {
      return res.status(404).json({ success: false, errors: 'QuizId  not found', data: null });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, errors: 'Quiz not found', data: null });
    }
    const answers = req.body.answers;
    if (!Array.isArray(answers) || answers.length < 1 || !answers.every(as => as.questionId && as.answer)) {
      return res.status(400).json({ message: 'Invalid answer format' });
    }
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      console.log(question._id.toString());
      const mandatoryCheck = quiz.questions[i].mandatory;
      if (mandatoryCheck && !answers.some(as => as?.questionId === question?._id?.toString())) {
        return res.status(400).json({ success: false, errors: "Mandatory Questions not answered", data: null });
        break;
      }
      const matchedQuestion = answers.find(as => as?.questionId === question?._id?.toString());
      if (matchedQuestion) {
        const answerIndex = matchedQuestion?.answer;
        if (answerIndex === question.answer) {
          score++;
        }
      }
    }
    const result = {
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      submittedAt: new Date(),
    };
    const submission = await QuizSubmission.create(result);
    res.json({ success: true, errors: null, data: submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: 'Internal server error', data: null });
  }

}

