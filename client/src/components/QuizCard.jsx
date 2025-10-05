import React from 'react'
import { Link } from 'react-router-dom'

const QuizCard = ({ quiz }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'batting':
        return '🏏'
      case 'bowling':
        return '⚾'
      case 'history':
        return '📚'
      case 'teams':
        return '👥'
      case 'records':
        return '📊'
      default:
        return '🎯'
    }
  }

  return (
    <div className="quiz-card border-2 border-gray-600 text-black rounded-xl shadow-lg overflow-hidden ">
      <div className="p-6 text-gray-500">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <span className=" text-2xl">{getCategoryIcon(quiz.category)}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {quiz.questions?.length || 0} questions
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-600 mb-2">
          {quiz.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {quiz.description || 'Test your cricket knowledge with this engaging quiz!'}
        </p>

        {/* Quiz Info */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>{quiz.timeLimit} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📂</span>
              <span>{quiz.category}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/quiz/${quiz._id}`}
          className="w-full bg-cricket-primary border border-b-blue-400 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-cricket-secondary transition-colors duration-200 btn-hover block"
        >
          Start Quiz
        </Link>
      </div>

      {/* Bottom Stats */}
      <div className=" px-6 py-3 border-t">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
          <span>
            {quiz.completionRate ? `${quiz.completionRate}% completion` : 'New'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuizCard