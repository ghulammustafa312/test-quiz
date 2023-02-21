const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    choices: {
      type: [String],
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
  }],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;