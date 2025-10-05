const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 10
  }
})

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Batting', 'Bowling', 'History', 'Teams', 'Records', 'General'],
    default: 'General'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 15, // minutes
    min: 1,
    max: 60
  },
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completionCount: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Calculate total points when questions are added
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((total, question) => total + (question.points || 10), 0)
  }
  next()
})

// Indexes for better query performance
quizSchema.index({ category: 1, difficulty: 1 })
quizSchema.index({ isActive: 1 })
quizSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Quiz', quizSchema)