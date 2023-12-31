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
  
    correctAnswer: {
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true
    }
  });

const subjectSchema = new Schema({
    subjectName: {type: String, required: true},
    questions: [questionSchema]
})

const SeriesSchema = new Schema({
    seriesName:{type: String, required: true},
    isEnabled: {
        type: Boolean,
        default: false
      },
    subjects: [subjectSchema]
});

const testSeries = new Schema({
    name:{type: String, required: true},
    testSeries: [SeriesSchema], 
    price: {
        type: Number,
        required: true,
        default: 0
      },
    type: {
        type: String,
        required: true,        
      }, 

});

const TestSeries = mongoose.model('testSeries', testSeries, 'TestSeriess');

module.exports = TestSeries;