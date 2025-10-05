import React, { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import BadgeDisplay from '../components/BadgeDisplay'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user, userBadges, fetchUserBadges, loading } = useApp()

  useEffect(() => {
    if (user) {
      fetchUserBadges()
    }
  }, [user])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const quizStats = {
    totalQuizzes: user.quiz_scores?.length || 0,
    averageScore: user.quiz_scores?.length 
      ? Math.round(user.quiz_scores.reduce((sum, score) => sum + score.score, 0) / user.quiz_scores.length)
      : 0,
    bestScore: user.quiz_scores?.length 
      ? Math.max(...user.quiz_scores.map(score => score.score))
      : 0,
    totalPoints: user.totalPoints || 0,
    currentStreak: user.streak || 0,
    level: user.level || 1
  }

  const getNextLevelPoints = (currentLevel) => {
    return currentLevel * 100 // Each level requires 100 more points than the previous
  }

  const getLevelProgress = () => {
    const currentLevelPoints = (quizStats.level - 1) * 100
    const nextLevelPoints = getNextLevelPoints(quizStats.level)
    const progressPoints = quizStats.totalPoints - currentLevelPoints
    return (progressPoints / (nextLevelPoints - currentLevelPoints)) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-light to-cyan-400 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="border-2  rounded-xl shadow-blue-950 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cricket-primary to-cricket-secondary flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold text-white">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user.username}
              </h1>
              <p className="text-lg text-gray-800 mb-2">
                Cricket Quiz Enthusiast
              </p>
              
              {/* User Details */}
              <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-1 sm:space-y-0 text-sm text-gray-800">
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                {user.profile?.favoriteTeam && (
                  <div>
                    <span className="font-semibold">Favorite Team:</span> {user.profile.favoriteTeam}
                  </div>
                )}
                {user.profile?.favoritePlayer && (
                  <div>
                    <span className="font-semibold">Favorite Player:</span> {user.profile.favoritePlayer}
                  </div>
                )}
              </div>

              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Level {quizStats.level}</span>
                  <span className="text-sm text-gray-600">
                    {quizStats.totalPoints} / {getNextLevelPoints(quizStats.level)} points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cricket-primary to-cricket-secondary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(getLevelProgress(), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-cricket-primary mb-2">
              {quizStats.level}
            </div>
            <div className="text-sm text-gray-800">Current Level</div>
          </div>

          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-cricket-secondary mb-2">
              {quizStats.totalPoints}
            </div>
            <div className="text-sm text-gray-800">Total Points</div>
          </div>

          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-cricket-accent mb-2">
              {quizStats.totalQuizzes}
            </div>
            <div className="text-sm text-gray-800">Quizzes Taken</div>
          </div>

          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {quizStats.averageScore}
            </div>
            <div className="text-sm text-gray-800">Avg Score</div>
          </div>

          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {quizStats.bestScore}
            </div>
            <div className="text-sm text-gray-800">Best Score</div>
          </div>

          <div className="border-2 rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-700 mb-2">
              {quizStats.currentStreak}
            </div>
            <div className="text-sm text-gray-800">Current Streak</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Badges Section */}
          <div className="border-4 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Achievements & Badges 🏆
            </h2>
            
            {userBadges?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Badges Yet
                </h3>
                <p className="text-gray-900 text-sm">
                  Complete more quizzes to earn your first badge!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userBadges.map((badge) => (
                  <BadgeDisplay key={badge._id} badge={badge} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Quiz History */}
          <div className="border-3 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Quiz History 📊
            </h2>
            
            {!user.quiz_scores || user.quiz_scores.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Quizzes Taken
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Start your cricket learning journey!
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-cricket-primary text-white px-6 py-2 rounded-lg hover:bg-cricket-secondary transition-colors duration-200"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {user.quiz_scores
                  .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                  .slice(0, 10)
                  .map((score, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">
                          Quiz #{score.quizId || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(score.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-cricket-primary">
                          {score.score} pts
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((score.timeSpent || 0) / 60)}m
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Actions */}
        <div className="border-4 rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-cricket-primary hover:bg-cricket-light transition-all duration-200 btn-hover"
            >
              <span className="text-3xl mb-2">🎯</span>
              <span className="font-semibold">Take Quiz</span>
            </button>

            <button
              onClick={() => window.location.href = '/players'}
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-cricket-primary hover:bg-cricket-light transition-all duration-200 btn-hover"
            >
              <span className="text-3xl mb-2">👥</span>
              <span className="font-semibold">Browse Players</span>
            </button>

            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-cricket-primary hover:bg-cricket-light transition-all duration-200 btn-hover"
            >
              <span className="text-3xl mb-2">🏆</span>
              <span className="font-semibold">Leaderboard</span>
            </button>

            <button className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-cricket-primary hover:bg-cricket-light transition-all duration-200 btn-hover">
              <span className="text-3xl mb-2">⚙️</span>
              <span className="font-semibold">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile