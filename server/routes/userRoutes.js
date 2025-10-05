const express = require('express')
const router = express.Router()
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUserBadges,
  getLeaderboard,
  getQuizHistory,
  getUserStats
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.use(protect) // Apply authentication to all routes below

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/badges', getUserBadges)
router.get('/leaderboard', getLeaderboard)
router.get('/quiz-history', getQuizHistory)
router.get('/stats', getUserStats)

module.exports = router