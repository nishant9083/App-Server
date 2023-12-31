const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const optionSchema = new Schema({
    option: {
      type: String,
      required: true
    }
  });
  
  const questionSchema = new Schema({
    question: {
      type: String,
      required: true
    },
    answers: [optionSchema],
  
    answer: {
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      default: ""
    }
  });

const quizAttemptSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: {type: String, required: true},
    chapter: {
        type: String,
        required: true,
        // ref: 'Quiz.chapter', // Reference to the specific chapter within the quiz
    },
    question: [questionSchema],
    selectedAnswer: {
        type: [Number], // Defines an array of numbers
        required: true, // You can specify whether the field is required
      },
    visited:{
        type: [Boolean],
        required: true
    },
    time:{type: String, required: true},
    timestamp: { type: Date, default: Date.now },
});


module.exports = QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema, 'QuizHistory');