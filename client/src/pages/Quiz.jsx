import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/LoadingSpinner'
import QuizTimer from '../components/QuizTimer'

const Quiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchQuiz, submitQuiz, currentQuiz, error } = useApp()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadQuiz()
    } else {
      setLoading(false)
    }
  }, [id])
  
  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await fetchQuiz(id)
    if (quiz) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert minutes to seconds
    }
    setLoading(false)
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleTimeUp = useCallback(() => {
    submitQuizAnswers()
  }, [selectedAnswers])

  
  const submitQuizAnswers = async () => {
  if (quizCompleted) return
  setQuizCompleted(true)
  const answers = Object.keys(selectedAnswers).map(questionIndex => ({
    questionIndex: parseInt(questionIndex),
    selectedAnswer: selectedAnswers[questionIndex]
  }))
  const quizResults = await submitQuiz(id, answers)
  console.log('Quiz Results:', quizResults) 
  if (quizResults) {
    setResults(quizResults)
  }
}
const goToQuestion = (index) => {
    setCurrentQuestion(index)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Select quiz page
  if (!id) {
    return (
      <div className="min-h-screen bg-[#181f2d] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">Select a Quiz</h1>
            <p className="text-lg text-gray-300 mb-8">
              Please go back to the home page and select a quiz to take.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-[#181f2d] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 btn-hover"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz not found
  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen bg-[#181f2d] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-6">Quiz Not Found</h1>
            <p className="text-lg text-gray-300 mb-8">
              The quiz you're looking for doesn't exist or couldn't be loaded.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-[#181f2d] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 btn-hover"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-[#181f2d] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              {results.percentage >= 80 ? '🏆' : results.percentage >= 60 ? '🥈' : '🥉'}
              <span className="text-6xl ml-2">🏏</span>
            </div>
            
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">
              Quiz Completed!
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-yellow-400">
                  {results.score}
                </div>
                <div className="text-gray-300">Total Score</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <div className="text-gray-300">Correct Answers</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-400">
                  {results.percentage}%
                </div>
                <div className="text-gray-300">Accuracy</div>
              </div>
            </div>

            {results.badge && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  🎉 Badge Earned!
                </h3>
                <p className="text-yellow-700">{results.badge.name}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-yellow-400 text-[#181f2d] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 btn-hover"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#181f2d] transition-colors duration-200 btn-hover"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pre-quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-[#181f2d] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-900 rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-yellow-400 mb-4">
                {currentQuiz.title}
              </h1>
              {currentQuiz.description && (
                <p className="text-lg text-gray-300 mb-6">
                  {currentQuiz.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {currentQuiz.questions.length}
                </div>
                <div className="text-gray-300">Questions</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {currentQuiz.timeLimit}
                </div>
                <div className="text-gray-300">Minutes</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {currentQuiz.difficulty}
                </div>
                <div className="text-gray-300">Difficulty</div>
              </div>
            </div>

            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-2">Quiz Instructions:</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• You have {currentQuiz.timeLimit} minutes to complete the quiz</li>
                <li>• Select the best answer for each question</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• Once submitted, answers cannot be changed</li>
                <li>• Timer will automatically submit when time runs out</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                className="bg-yellow-400 text-[#181f2d] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 btn-hover shadow-lg"
              >
                Start Quiz 🏏
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz taking screen
  const currentQ = currentQuiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-[#181f2d] text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Timer and Progress */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-gray-100">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </div>
            <QuizTimer
              timeRemaining={timeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === option
                    ? 'border-yellow-400 bg-gray-800 text-yellow-400'
                    : 'border-gray-700 bg-gray-900 hover:border-yellow-400 hover:bg-gray-800 hover:text-yellow-400'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 text-sm font-semibold">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-[#181f2d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {currentQuiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    index === currentQuestion
                      ? 'bg-yellow-400 text-[#181f2d]'
                      : selectedAnswers[index]
                      ? 'bg-blue-400 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700 hover:text-yellow-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              {currentQuestion < currentQuiz.questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-yellow-400 text-[#181f2d] rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitQuizAnswers}
                  className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
  
  
}

export default Quiz
