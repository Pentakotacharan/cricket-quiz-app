const mongoose = require('mongoose')

const criteriaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['quiz_score', 'streak', 'category_expert', 'total_points', 'quiz_count', 'perfect_score', 'speed_demon'],
    trim: true
  },
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    trim: true // Only used for category_expert type
  }
})

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  criteria: criteriaSchema,
  icon: {
    type: String,
    trim: true,
    default: '🏅'
  },
  rarity: {
    type: String,
    required: true,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  points: {
    type: Number,
    required: true,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#6B7280' // Gray color
  }
}, {
  timestamps: true
})

// Indexes for better query performance
badgeSchema.index({ rarity: 1 })
badgeSchema.index({ 'criteria.type': 1 })
badgeSchema.index({ isActive: 1 })

// Static method to check if user qualifies for any badges
badgeSchema.statics.checkUserBadges = async function(user) {
  const badges = await this.find({ isActive: true })
  const qualifiedBadges = []
  
  for (const badge of badges) {
    // Skip if user already has this badge
    if (user.badges.includes(badge._id)) {
      continue
    }
    
    let qualified = false
    
    switch (badge.criteria.type) {
      case 'quiz_score':
        // Check if user has achieved the required score in any quiz
        qualified = user.quiz_scores.some(score => score.score >= badge.criteria.value)
        break
        
      case 'streak':
        // Check if user has achieved the required streak
        qualified = user.streak >= badge.criteria.value
        break
        
      case 'category_expert':
        // Check if user has completed enough quizzes in a specific category
        // This would require quiz data to check categories
        qualified = false // Placeholder - implement based on quiz completion tracking
        break
        
      case 'total_points':
        // Check if user has achieved the required total points
        qualified = user.totalPoints >= badge.criteria.value
        break
        
      case 'quiz_count':
        // Check if user has completed the required number of quizzes
        qualified = user.quiz_scores.length >= badge.criteria.value
        break
        
      case 'perfect_score':
        // Check if user has achieved perfect score (100%) in required number of quizzes
        const perfectScores = user.quiz_scores.filter(score => score.percentage === 100)
        qualified = perfectScores.length >= badge.criteria.value
        break
        
      case 'speed_demon':
        // Check if user has completed a quiz within the required time
        // This would need time tracking relative to quiz time limits
        qualified = false // Placeholder - implement based on time tracking
        break
    }
    
    if (qualified) {
      qualifiedBadges.push(badge)
    }
  }
  
  return qualifiedBadges
}

module.exports = mongoose.model('Badge', badgeSchema)