const express = require('express')
const router = express.Router()
const {
  getQuizzes,
  getQuiz,
  submitQuiz,
  getQuizResults,
  createQuiz,
  getCategories
} = require('../controllers/quizController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Public routes (none for quizzes - all require authentication)

// Protected routes
router.use(protect) // Apply authentication to all routes below

router.route('/')
  .get(getQuizzes)
  .post(authorize('admin'), createQuiz) // Admin only

router.get('/categories', getCategories)

router.route('/:id')
  .get(getQuiz)

router.post('/:id/submit', submitQuiz)
router.get('/:id/results', getQuizResults)

module.exports = router