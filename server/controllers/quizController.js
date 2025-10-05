const Quiz = require('../models/Quiz')
const User = require('../models/User')
const Badge = require('../models/Badge')
const { calculateScore } = require('../utils/scoreCalculator')
const Joi = require('joi')

// Validation schemas
const createQuizSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  description: Joi.string().trim().max(1000),
  category: Joi.string().valid('Batting', 'Bowling', 'History', 'Teams', 'Records', 'General').required(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
  timeLimit: Joi.number().min(1).max(60).required(),
  questions: Joi.array().items(Joi.object({
    question: Joi.string().required().trim().min(10),
    options: Joi.array().items(Joi.string().required().trim()).min(2).max(6).required(),
    correctAnswer: Joi.string().required().trim(),
    explanation: Joi.string().trim(),
    points: Joi.number().min(1).max(100).default(10)
  })).min(1).max(50).required()
})

const submitQuizSchema = Joi.object({
  answers: Joi.array().items(Joi.object({
    questionIndex: Joi.number().required(),
    selectedAnswer: Joi.string().required().trim()
  })).required()
})

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query
    
    const query = { isActive: true }
    
    if (category) {
      query.category = category
    }
    
    if (difficulty) {
      query.difficulty = difficulty
    }
    
    const skip = (page - 1) * limit
    
    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    const total = await Quiz.countDocuments(query)
    
    res.status(200).json({
      success: true,
      data: {
        quizzes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get quizzes error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quizzes'
    })
  }
}

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation')
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }
    
    if (!quiz.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Quiz is not available'
      })
    }
    
    res.status(200).json({
      success: true,
      data: {
        quiz
      }
    })
  } catch (error) {
    console.error('Get quiz error:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz'
    })
  }
}

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { error, value } = submitQuizSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }
    
    const { answers } = value
    
    const quiz = await Quiz.findById(req.params.id)
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }
    
    if (!quiz.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Quiz is not available'
      })
    }
    
    // Calculate score
    const results = calculateScore(quiz, answers)
    
    // Create quiz score record
    const quizScore = {
      quizId: quiz._id,
      score: results.score,
      totalQuestions: quiz.questions.length,
      correctAnswers: results.correctAnswers,
      timeSpent: results.timeSpent || (quiz.timeLimit * 60), // Default to full time if not provided
      percentage: results.percentage
    }
    
    // Update user record
    const user = await User.findById(req.user.id)
    user.addQuizScore(quizScore)
    
    // Check for new badges
    const newBadges = await Badge.checkUserBadges(user)
    
    if (newBadges.length > 0) {
      user.badges.push(...newBadges.map(badge => badge._id))
      user.totalPoints += newBadges.reduce((total, badge) => total + badge.points, 0)
      results.earnedBadges = newBadges
    }
    
    await user.save()
    
    // Update quiz statistics
    quiz.completionCount += 1
    const allScores = await User.aggregate([
      { $unwind: '$quiz_scores' },
      { $match: { 'quiz_scores.quizId': quiz._id } },
      { $group: { _id: null, avgScore: { $avg: '$quiz_scores.score' } } }
    ])
    
    if (allScores.length > 0) {
      quiz.averageScore = Math.round(allScores[0].avgScore)
    }
    
    await quiz.save()
    
    res.status(200).json({
      success: true,
      data: {
        results: {
          ...results,
          earnedBadges: newBadges || []
        }
      }
    })
  } catch (error) {
    console.error('Submit quiz error:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quiz'
    })
  }
}

// @desc    Get quiz results with explanations
// @route   GET /api/quizzes/:id/results
// @access  Private
const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }
    
    // Get user's latest attempt for this quiz
    const user = await User.findById(req.user.id)
    const userScore = user.quiz_scores
      .filter(score => score.quizId.toString() === quiz._id.toString())
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
    
    if (!userScore) {
      return res.status(404).json({
        success: false,
        message: 'No quiz attempt found'
      })
    }
    
    // Get leaderboard for this quiz
    const leaderboard = await User.aggregate([
      { $unwind: '$quiz_scores' },
      { $match: { 'quiz_scores.quizId': quiz._id } },
      { $group: {
        _id: '$_id',
        username: { $first: '$username' },
        bestScore: { $max: '$quiz_scores.score' },
        bestPercentage: { $max: '$quiz_scores.percentage' }
      }},
      { $sort: { bestScore: -1, bestPercentage: -1 } },
      { $limit: 10 }
    ])
    
    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          questions: quiz.questions // Include explanations
        },
        userScore,
        leaderboard
      }
    })
  } catch (error) {
    console.error('Get quiz results error:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results'
    })
  }
}

// @desc    Create new quiz (Admin only)
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { error, value } = createQuizSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }
    
    // Validate that correct answers exist in options
    for (const question of value.questions) {
      if (!question.options.includes(question.correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: `Correct answer "${question.correctAnswer}" is not in the options for question: ${question.question}`
        })
      }
    }
    
    const quiz = await Quiz.create(value)
    
    res.status(201).json({
      success: true,
      data: {
        quiz
      }
    })
  } catch (error) {
    console.error('Create quiz error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Quiz with this title already exists'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating quiz'
    })
  }
}

// @desc    Get quiz categories
// @route   GET /api/quizzes/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Quiz.distinct('category', { isActive: true })
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Quiz.countDocuments({ category, isActive: true })
        return { name: category, count }
      })
    )
    
    res.status(200).json({
      success: true,
      data: {
        categories: categoriesWithCount
      }
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    })
  }
}

module.exports = {
  getQuizzes,
  getQuiz,
  submitQuiz,
  getQuizResults,
  createQuiz,
  getCategories
}