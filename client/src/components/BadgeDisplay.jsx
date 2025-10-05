import React from 'react'

const BadgeDisplay = ({ badge, earned = false, progress = null }) => {
  const getBadgeIcon = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'platinum':
        return '💎'
      case 'gold':
        return '🥇'
      case 'silver':
        return '🥈'
      case 'bronze':
        return '🥉'
      default:
        return '🏅'
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'platinum':
        return 'from-purple-400 to-purple-600'
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'silver':
        return 'from-gray-300 to-gray-500'
      case 'bronze':
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getBadgeBackground = () => {
    if (!earned && progress === null) {
      return 'bg-gray-100 border-gray-200'
    }
    return 'bg-white border-2 border-transparent'
  }

  const getTextColor = () => {
    if (!earned && progress === null) {
      return 'text-gray-500'
    }
    return 'text-gray-900'
  }

  return (
    <div className={`relative rounded-xl p-4 transition-all duration-300 hover:scale-105 ${getBadgeBackground()}`}>
      {/* Badge Icon */}
      <div className="text-center mb-3">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center mx-auto mb-2 shadow-lg ${!earned && progress === null ? 'opacity-50' : ''}`}>
          <span className="text-2xl">
            {badge.icon || getBadgeIcon(badge.rarity)}
          </span>
        </div>
        
        {/* Rarity Label */}
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
          badge.rarity?.toLowerCase() === 'platinum' ? 'bg-purple-100 text-purple-800' :
          badge.rarity?.toLowerCase() === 'gold' ? 'bg-yellow-100 text-yellow-800' :
          badge.rarity?.toLowerCase() === 'silver' ? 'bg-gray-100 text-gray-800' :
          badge.rarity?.toLowerCase() === 'bronze' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          {badge.rarity || 'Common'}
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className={`font-semibold text-sm mb-1 ${getTextColor()}`}>
          {badge.name}
        </h3>
        <p className={`text-xs ${getTextColor()} opacity-80 line-clamp-2`}>
          {badge.description}
        </p>
      </div>

      {/* Progress Bar (if badge is not earned but has progress) */}
      {!earned && progress !== null && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Earned Indicator */}
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Points Value */}
      {badge.points && (
        <div className="absolute -top-2 -left-2 bg-cricket-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {badge.points}
        </div>
      )}

      {/* Lock Icon for Unearned Badges */}
      {!earned && progress === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default BadgeDisplay