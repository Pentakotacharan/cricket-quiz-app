const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const quizScoreSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
})

const profileSchema = new mongoose.Schema({
  favoriteTeam: {
    type: String,
    trim: true
  },
  favoritePlayer: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
    default: 'Beginner'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: profileSchema,
  quiz_scores: [quizScoreSchema],
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastQuizDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Calculate level based on total points
userSchema.methods.calculateLevel = function() {
  // Level progression: Level 1 = 0-99 points, Level 2 = 100-299 points, etc.
  this.level = Math.floor(this.totalPoints / 100) + 1
  return this.level
}

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (this.lastQuizDate) {
    const lastQuizDate = new Date(this.lastQuizDate)
    lastQuizDate.setHours(0, 0, 0, 0)
    
    const daysDiff = (today - lastQuizDate) / (1000 * 60 * 60 * 24)
    
    if (daysDiff === 1) {
      // Consecutive day
      this.streak += 1
    } else if (daysDiff > 1) {
      // Streak broken
      this.streak = 1
    }
    // If daysDiff === 0, it's the same day, don't change streak
  } else {
    // First quiz
    this.streak = 1
  }
  
  this.lastQuizDate = new Date()
}

// Add quiz score and update user stats
userSchema.methods.addQuizScore = function(scoreData) {
  this.quiz_scores.push(scoreData)
  this.totalPoints += scoreData.score
  this.calculateLevel()
  this.updateStreak()
}

// Get user statistics
userSchema.methods.getStats = function() {
  const scores = this.quiz_scores
  
  if (scores.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      averagePercentage: 0,
      totalTimeSpent: 0
    }
  }
  
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0)
  const totalPercentage = scores.reduce((sum, score) => sum + score.percentage, 0)
  const totalTime = scores.reduce((sum, score) => sum + score.timeSpent, 0)
  
  return {
    totalQuizzes: scores.length,
    averageScore: Math.round(totalScore / scores.length),
    bestScore: Math.max(...scores.map(s => s.score)),
    averagePercentage: Math.round(totalPercentage / scores.length),
    totalTimeSpent: totalTime
  }
}

// Indexes for better query performance
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ totalPoints: -1 })
userSchema.index({ level: -1 })
userSchema.index({ createdAt: -1 })

module.exports = mongoose.model('User', userSchema)