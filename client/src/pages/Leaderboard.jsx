import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Leaderboard = () => {
  const { leaderboard, fetchLeaderboard, loading, user } = useApp()
  const [timeFilter, setTimeFilter] = useState('all-time')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏏'
    }
  }

  const getUserRank = () => {
    if (!user || !leaderboard.length) return null
    const userIndex = leaderboard.findIndex(entry => entry.userId === user._id)
    return userIndex !== -1 ? userIndex + 1 : null
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const userRank = getUserRank()

  return (
    <div className="min-h-screen bg-[#181f2d] text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Leaderboard 🏆
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how you rank against other cricket quiz masters. 
            Compete, learn, and climb to the top!
          </p>
        </div>

        {/* User's Rank Card */}
        {user && userRank && (
          <div className="bg-gradient-to-r from-yellow-400 to-blue-500 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getRankIcon(userRank)}</div>
                <div>
                  <h3 className="text-xl font-semibold">Your Rank</h3>
                  <p className="text-gray-200">#{userRank} out of {leaderboard.length} players</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{user.totalPoints || 0}</div>
                <div className="text-gray-200">Total Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Options */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">
              Top Players
            </h2>
            <div className="flex space-x-2">
              {['all-time', 'this-month', 'this-week'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    timeFilter === filter
                      ? 'bg-yellow-400 text-[#181f2d]'
                      : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {filter.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        {leaderboard.length === 0 ? (
          <div className="bg-gray-900 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏏</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No Rankings Yet
            </h3>
            <p className="text-gray-200 mb-6">
              Be the first to complete a quiz and claim the top spot!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-yellow-400 text-[#181f2d] px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-semibold"
            >
              Take a Quiz
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            {/* Top 3 Podium */}
            <div className="bg-gradient-to-r from-blue-500 to-yellow-400 p-8">
              <div className="flex justify-center items-end space-x-8">
                {leaderboard.slice(0, 3).map((player, index) => {
                  const position = index + 1
                  const heights = ['h-32', 'h-40', 'h-28']
                  const bgColors = ['bg-blue-400', 'bg-yellow-400', 'bg-gray-400']
                  return (
                    <div key={player.userId} className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-2 shadow-lg">
                          <span className="text-2xl font-bold text-yellow-400">
                            {player.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {player.username || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-100">
                          {player.totalPoints} points
                        </div>
                      </div>
                      <div className={`${heights[index]} ${bgColors[index]} rounded-t-lg flex items-end justify-center p-4`}>
                        <div className="text-4xl">{getRankIcon(position)}</div>
                      </div>
                      <div className="bg-gray-900 text-yellow-400 py-2 rounded-b-lg">
                        <div className="text-xl font-bold">#{position}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rest of the leaderboard */}
            {leaderboard.length > 3 && (
              <div className="divide-y divide-gray-800">
                {leaderboard.slice(3).map((player, index) => {
                  const position = index + 4
                  const isCurrentUser = user && player.userId === user._id
                  return (
                    <div
                      key={player.userId}
                      className={`p-4 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200 ${
                        isCurrentUser ? 'bg-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-yellow-400 w-12 text-center">
                          #{position}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                          <span className="text-lg font-semibold text-yellow-400">
                            {player.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-yellow-400'}`}>
                            {player.username || 'Unknown User'}
                            {isCurrentUser && <span className="ml-2 text-sm text-blue-300">(You)</span>}
                          </div>
                          <div className="text-sm text-gray-200">
                            Level {player.level || 1}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {player.totalPoints} pts
                        </div>
                        <div className="text-sm text-gray-200">
                          {player.quizzesTaken || 0} quizzes
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {leaderboard.length}
            </div>
            <div className="text-gray-200">Total Players</div>
          </div>
          
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {leaderboard.reduce((sum, player) => sum + (player.totalPoints || 0), 0)}
            </div>
            <div className="text-gray-200">Total Points Earned</div>
          </div>
          
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {Math.round(leaderboard.reduce((sum, player) => sum + (player.totalPoints || 0), 0) / leaderboard.length) || 0}
            </div>
            <div className="text-gray-200">Average Points</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
