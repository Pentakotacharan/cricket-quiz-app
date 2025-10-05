/**
 * Calculate quiz score based on user answers
 * @param {Object} quiz - The quiz object with questions and correct answers
 * @param {Array} answers - Array of user answers with questionIndex and selectedAnswer
 * @returns {Object} - Score calculation results
 */
const calculateScore = (quiz, answers) => {
  if (!quiz || !quiz.questions || !Array.isArray(answers)) {
    throw new Error('Invalid quiz or answers data')
  }

  const results = {
    score: 0,
    totalQuestions: quiz.questions.length,
    correctAnswers: 0,
    wrongAnswers: 0,
    unanswered: 0,
    percentage: 0,
    timeSpent: 0,
    detailed: []
  }

  // Create a map of answers for quick lookup
  const answerMap = new Map()
  answers.forEach(answer => {
    if (answer.questionIndex !== undefined && answer.selectedAnswer !== undefined) {
      answerMap.set(answer.questionIndex, answer.selectedAnswer)
    }
  })

  // Check each question
  quiz.questions.forEach((question, index) => {
    const userAnswer = answerMap.get(index)
    const correctAnswer = question.correctAnswer
    const questionPoints = question.points || 10

    const questionResult = {
      questionIndex: index,
      question: question.question,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer || null,
      isCorrect: false,
      points: 0,
      possiblePoints: questionPoints
    }

    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      // Unanswered question
      results.unanswered++
      questionResult.status = 'unanswered'
    } else if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      // Correct answer
      results.correctAnswers++
      results.score += questionPoints
      questionResult.isCorrect = true
      questionResult.points = questionPoints
      questionResult.status = 'correct'
    } else {
      // Wrong answer
      results.wrongAnswers++
      questionResult.status = 'wrong'
    }

    results.detailed.push(questionResult)
  })

  // Calculate percentage
  const totalPossiblePoints = quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0)
  results.percentage = totalPossiblePoints > 0 ? Math.round((results.score / totalPossiblePoints) * 100) : 0

  // Calculate time-based bonus (if implemented)
  results.timeBonus = 0

  return results
}

/**
 * Calculate time-based scoring bonus
 * @param {number} timeSpent - Time spent in seconds
 * @param {number} timeLimit - Time limit in seconds
 * @param {number} baseScore - Base score without time bonus
 * @returns {number} - Time bonus points
 */
const calculateTimeBonus = (timeSpent, timeLimit, baseScore) => {
  if (!timeSpent || !timeLimit || timeSpent >= timeLimit) {
    return 0
  }

  // Calculate time efficiency (0-1)
  const timeEfficiency = Math.max(0, (timeLimit - timeSpent) / timeLimit)
  
  // Award up to 20% bonus for completing early
  const maxBonus = baseScore * 0.2
  const timeBonus = Math.round(maxBonus * timeEfficiency)

  return timeBonus
}

/**
 * Calculate difficulty-based score multiplier
 * @param {string} difficulty - Quiz difficulty level
 * @returns {number} - Score multiplier
 */
const getDifficultyMultiplier = (difficulty) => {
  const multipliers = {
    'Easy': 1.0,
    'Medium': 1.2,
    'Hard': 1.5
  }

  return multipliers[difficulty] || 1.0
}

/**
 * Calculate category expertise bonus
 * @param {Array} userScores - User's previous quiz scores
 * @param {string} category - Current quiz category
 * @returns {number} - Expertise bonus percentage (0-50)
 */
const calculateCategoryExpertise = (userScores, category) => {
  if (!userScores || !Array.isArray(userScores) || !category) {
    return 0
  }

  // Filter scores for the same category
  const categoryScores = userScores.filter(score => 
    score.quizId && score.quizId.category === category
  )

  if (categoryScores.length < 3) {
    return 0 // Need at least 3 quizzes in category
  }

  // Calculate average percentage in category
  const avgPercentage = categoryScores.reduce((sum, score) => 
    sum + score.percentage, 0
  ) / categoryScores.length

  // Award expertise bonus based on performance
  if (avgPercentage >= 90) return 50 // Expert level
  if (avgPercentage >= 80) return 30 // Advanced level
  if (avgPercentage >= 70) return 15 // Intermediate level

  return 0
}

/**
 * Calculate streak bonus
 * @param {number} streak - Current user streak
 * @returns {number} - Streak bonus percentage (0-25)
 */
const calculateStreakBonus = (streak) => {
  if (!streak || streak < 2) return 0

  // Award increasing bonus for longer streaks
  if (streak >= 30) return 25 // Max bonus
  if (streak >= 20) return 20
  if (streak >= 10) return 15
  if (streak >= 5) return 10
  if (streak >= 2) return 5

  return 0
}

/**
 * Calculate comprehensive score with all bonuses
 * @param {Object} quiz - Quiz object
 * @param {Array} answers - User answers
 * @param {Object} options - Additional options for scoring
 * @returns {Object} - Comprehensive scoring results
 */
const calculateComprehensiveScore = (quiz, answers, options = {}) => {
  const baseResults = calculateScore(quiz, answers)
  
  const {
    timeSpent = quiz.timeLimit * 60, // Default to full time
    userScores = [],
    userStreak = 0
  } = options

  // Apply difficulty multiplier
  const difficultyMultiplier = getDifficultyMultiplier(quiz.difficulty)
  const adjustedScore = Math.round(baseResults.score * difficultyMultiplier)

  // Calculate various bonuses
  const timeBonus = calculateTimeBonus(timeSpent, quiz.timeLimit * 60, adjustedScore)
  const categoryBonus = Math.round(adjustedScore * (calculateCategoryExpertise(userScores, quiz.category) / 100))
  const streakBonus = Math.round(adjustedScore * (calculateStreakBonus(userStreak) / 100))

  const finalResults = {
    ...baseResults,
    baseScore: baseResults.score,
    difficultyMultiplier,
    adjustedScore,
    timeSpent,
    bonuses: {
      time: timeBonus,
      category: categoryBonus,
      streak: streakBonus
    },
    totalBonus: timeBonus + categoryBonus + streakBonus,
    finalScore: adjustedScore + timeBonus + categoryBonus + streakBonus
  }

  // Update the main score field
  finalResults.score = finalResults.finalScore

  return finalResults
}

/**
 * Validate quiz answers format
 * @param {Array} answers - User answers to validate
 * @returns {Object} - Validation result
 */
const validateAnswers = (answers) => {
  const errors = []

  if (!Array.isArray(answers)) {
    errors.push('Answers must be an array')
    return { isValid: false, errors }
  }

  answers.forEach((answer, index) => {
    if (typeof answer.questionIndex !== 'number') {
      errors.push(`Answer ${index}: questionIndex must be a number`)
    }

    if (typeof answer.selectedAnswer !== 'string') {
      errors.push(`Answer ${index}: selectedAnswer must be a string`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

module.exports = {
  calculateScore,
  calculateTimeBonus,
  getDifficultyMultiplier,
  calculateCategoryExpertise,
  calculateStreakBonus,
  calculateComprehensiveScore,
  validateAnswers
}