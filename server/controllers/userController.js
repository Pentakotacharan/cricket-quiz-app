const User = require('../models/User')
const Badge = require('../models/Badge')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().required().trim().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().required().min(6).max(128),
  favoriteTeam: Joi.string().trim().max(50),
  favoritePlayer: Joi.string().trim().max(100)
})

const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().required()
})

const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/),
  favoriteTeam: Joi.string().trim().max(50),
  favoritePlayer: Joi.string().trim().max(100),
  experienceLevel: Joi.string().valid('Beginner', 'Intermediate', 'Expert'),
  bio: Joi.string().trim().max(500)
})

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  })
}

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { error, value } = registerSchema.validate(req.body)
     
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { username, email, password, favoriteTeam, favoritePlayer } = value

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        })
      } else {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        })
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profile: {
        favoriteTeam: favoriteTeam || '',
        favoritePlayer: favoritePlayer || ''
      }
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          level: user.level,
          totalPoints: user.totalPoints,
          streak: user.streak,
          quiz_scores: user.quiz_scores
        }
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { email, password } = value

    // Check if user exists
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          level: user.level,
          totalPoints: user.totalPoints,
          streak: user.streak,
          quiz_scores: user.quiz_scores
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const stats = user.getStats()

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          level: user.level,
          totalPoints: user.totalPoints,
          streak: user.streak,
          quiz_scores: user.quiz_scores,
          badges: user.badges,
          stats,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { username, favoriteTeam, favoritePlayer, experienceLevel, bio } = value

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if new username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        })
      }
      user.username = username
    }

    // Update profile fields
    if (favoriteTeam !== undefined) user.profile.favoriteTeam = favoriteTeam
    if (favoritePlayer !== undefined) user.profile.favoritePlayer = favoritePlayer
    if (experienceLevel !== undefined) user.profile.experienceLevel = experienceLevel
    if (bio !== undefined) user.profile.bio = bio

    await user.save()

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          level: user.level,
          totalPoints: user.totalPoints,
          streak: user.streak
        }
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    })
  }
}

// @desc    Get user badges
// @route   GET /api/users/badges
// @access  Private
const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get all available badges to show progress
    const allBadges = await Badge.find({ isActive: true })
    
    const badgesWithProgress = allBadges.map(badge => {
      const earned = user.badges.some(userBadge => userBadge._id.toString() === badge._id.toString())
      
      let progress = 0
      if (!earned) {
        // Calculate progress based on badge criteria
        switch (badge.criteria.type) {
          case 'total_points':
            progress = Math.min((user.totalPoints / badge.criteria.value) * 100, 100)
            break
          case 'streak':
            progress = Math.min((user.streak / badge.criteria.value) * 100, 100)
            break
          case 'quiz_count':
            progress = Math.min((user.quiz_scores.length / badge.criteria.value) * 100, 100)
            break
          case 'perfect_score':
            const perfectScores = user.quiz_scores.filter(score => score.percentage === 100)
            progress = Math.min((perfectScores.length / badge.criteria.value) * 100, 100)
            break
          default:
            progress = 0
        }
      }

      return {
        ...badge.toObject(),
        earned,
        progress: earned ? 100 : Math.round(progress)
      }
    })

    res.status(200).json({
      success: true,
      data: {
        badges: badgesWithProgress
      }
    })
  } catch (error) {
    console.error('Get user badges error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching badges'
    })
  }
}

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'all-time', limit = 50 } = req.query

    let matchStage = { isActive: true }

    // Add time-based filtering if needed
    if (timeframe === 'this-week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchStage.lastQuizDate = { $gte: weekAgo }
    } else if (timeframe === 'this-month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchStage.lastQuizDate = { $gte: monthAgo }
    }

    const leaderboard = await User.find(matchStage)
      .select('username totalPoints level streak quiz_scores createdAt')
      .sort({ totalPoints: -1, level: -1, createdAt: 1 })
      .limit(parseInt(limit))

    // Add additional stats
    const leaderboardWithStats = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      totalPoints: user.totalPoints,
      level: user.level,
      streak: user.streak,
      quizzesTaken: user.quiz_scores.length,
      averageScore: user.quiz_scores.length > 0 
        ? Math.round(user.quiz_scores.reduce((sum, score) => sum + score.score, 0) / user.quiz_scores.length)
        : 0
    }))

    res.status(200).json({
      success: true,
      data: {
        leaderboard: leaderboardWithStats,
        timeframe,
        count: leaderboardWithStats.length
      }
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    })
  }
}

// @desc    Get user quiz history
// @route   GET /api/users/quiz-history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const user = await User.findById(req.user.id)
      .populate({
        path: 'quiz_scores.quizId',
        select: 'title category difficulty'
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Sort quiz scores by completion date (newest first)
    const sortedScores = user.quiz_scores.sort((a, b) => 
      new Date(b.completedAt) - new Date(a.completedAt)
    )

    const skip = (page - 1) * limit
    const paginatedScores = sortedScores.slice(skip, skip + parseInt(limit))

    res.status(200).json({
      success: true,
      data: {
        quizHistory: paginatedScores,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: sortedScores.length,
          pages: Math.ceil(sortedScores.length / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get quiz history error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz history'
    })
  }
}

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const stats = user.getStats()

    // Additional detailed stats
    const categoryStats = user.quiz_scores.reduce((acc, score) => {
      if (score.quizId && score.quizId.category) {
        const category = score.quizId.category
        if (!acc[category]) {
          acc[category] = { count: 0, totalScore: 0, totalPercentage: 0 }
        }
        acc[category].count++
        acc[category].totalScore += score.score
        acc[category].totalPercentage += score.percentage
      }
      return acc
    }, {})

    // Calculate category averages
    Object.keys(categoryStats).forEach(category => {
      const cat = categoryStats[category]
      cat.averageScore = Math.round(cat.totalScore / cat.count)
      cat.averagePercentage = Math.round(cat.totalPercentage / cat.count)
    })

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        categoryStats,
        totalPoints: user.totalPoints,
        level: user.level,
        streak: user.streak,
        badgeCount: user.badges.length
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUserBadges,
  getLeaderboard,
  getQuizHistory,
  getUserStats
}