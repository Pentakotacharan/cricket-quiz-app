import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import QuizCard from '../components/QuizCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const { user, quizzes, fetchQuizzes, loading } = useApp()

  useEffect(() => {
    if (user) {
      fetchQuizzes()
    }
  }, [user])

  // ----- Guest (not logged in) -----
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a2233] text-white">
        <div className="text-center max-w-4xl px-4">
          <div className="mb-8">
            <span className="text-8xl">🏏</span>
          </div>
          <h1 className="text-6xl font-bold text-yellow-400 mb-6">
            Cricket Quiz & Learning
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Test your cricket knowledge, learn about legendary players, and compete with friends 
            in the ultimate cricket quiz experience!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-yellow-400 text-[#1a2233] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 btn-hover shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-[#1a2233] transition-colors duration-200 btn-hover"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#1a2233]">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Quizzes</h3>
              <p className="text-gray-300">Test your knowledge with challenging multiple-choice questions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#1a2233]">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Player Database</h3>
              <p className="text-gray-300">Explore detailed profiles of cricket legends and current stars</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#1a2233]">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Leaderboards</h3>
              <p className="text-gray-300">Compete with others and earn badges for your achievements</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ----- Loading spinner -----
  if (loading) {
    return <LoadingSpinner />
  }

  // ----- Logged in -----
  return (
    <div className="min-h-screen bg-[#1a2233] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Welcome back, {user?.username}! 🏏
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Ready to test your cricket knowledge? Choose from our collection of quizzes 
            covering everything from legendary players to match statistics.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{user?.level || 1}</div>
            <div className="text-gray-300">Current Level</div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{user?.totalPoints || 0}</div>
            <div className="text-gray-300">Total Points</div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{user?.streak || 0}</div>
            <div className="text-gray-300">Current Streak</div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-400">{user?.quiz_scores?.length || 0}</div>
            <div className="text-gray-300">Quizzes Completed</div>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Available Quizzes</h2>
          
          {quizzes?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No Quizzes Available</h3>
              <p className="text-gray-300">Check back later for new quizzes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes?.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/players"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-700 hover:border-yellow-400 hover:bg-gray-800 transition-all duration-200 btn-hover"
            >
              <span className="text-4xl mb-3 text-yellow-400">👥</span>
              <h3 className="text-lg font-semibold text-white mb-2">Explore Players</h3>
              <p className="text-gray-300 text-center text-sm">
                Browse cricket player profiles and statistics
              </p>
            </Link>

            <Link
              to="/leaderboard"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-700 hover:border-yellow-400 hover:bg-gray-800 transition-all duration-200 btn-hover"
            >
              <span className="text-4xl mb-3 text-yellow-400">🏆</span>
              <h3 className="text-lg font-semibold text-white mb-2">Leaderboard</h3>
              <p className="text-gray-300 text-center text-sm">
                See how you rank against other quiz masters
              </p>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-700 hover:border-yellow-400 hover:bg-gray-800 transition-all duration-200 btn-hover"
            >
              <span className="text-4xl mb-3 text-yellow-400">👤</span>
              <h3 className="text-lg font-semibold text-white mb-2">My Profile</h3>
              <p className="text-gray-300 text-center text-sm">
                View your achievements and progress
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
