import React, { useState } from 'react'

const PlayerCard = ({ player }) => {
  
  const [showFullStats, setShowFullStats] = useState(false)

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'batsman':
        return '🏏'
      case 'bowler':
        return '⚾'
      case 'all-rounder':
        return '🌟'
      case 'wicket-keeper':
        return '🧤'
      default:
        return '👤'
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <div className="bg-emerald-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Player Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-cricket-primary to-cricket-secondary">
        {player.image_url ? (
          <img
            src={player.image_url}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-black">{getRoleIcon(player.role)}</span>
          </div>
        )}
        
        {/* Country Flag/Badge */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-gray-700">{player.country}</span>
        </div>

        {/* Active Status */}
        {player.isActive && (
          <div className="absolute top-4 left-4 bg-green-500 rounded-full px-2 py-1">
            <span className="text-xs font-semibold text-white">Active</span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="p-6">
        
        {/* Name and Role */}
        <div className="mb-4">
          <h3 className="text-5xl font-bold text-black mb-1">
            {player.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-cricket-primary font-semibold">
              {getRoleIcon(player.role)} {player.role}
            </span>
            <span className="text-sm text-gray-800">{player.team}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {player.stats?.matches && (
            <div className="text-center">
              <div className="text-lg font-bold text-cricket-primary">
                {formatNumber(player.stats.matches)}
              </div>
              <div className="text-xs text-gray-950">Matches</div>
            </div>
          )}
          
          {player.stats?.runs && (
            <div className="text-center">
              <div className="text-lg font-bold text-cricket-secondary">
                {formatNumber(player.stats.runs)}
              </div>
              <div className="text-xs text-gray-950">Runs</div>
            </div>
          )}
          
          {player.stats?.wickets && (
            <div className="text-center">
              <div className="text-lg font-bold text-cricket-accent">
                {formatNumber(player.stats.wickets)}
              </div>
              <div className="text-xs text-gray-900">Wickets</div>
            </div>
          )}
          
          {player.stats?.average && (
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">
                {player.stats.average.toFixed(1)}
              </div>
              <div className="text-xs text-gray-950">Average</div>
            </div>
          )}
        </div>

        {/* Expandable Detailed Stats */}
        {player.stats && (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowFullStats(!showFullStats)}
              className="w-full text-cricket-primary hover:text-cricket-secondary transition-colors duration-200 text-sm font-semibold mb-2"
            >
              {showFullStats ? 'Hide Details ▼' : 'Show Details ▶'}
            </button>
            
            {showFullStats && (
              <div className="space-y-3 text-sm">
                {player.stats.strikeRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-950">Strike Rate:</span>
                    <span className="font-semibold">{player.stats.strikeRate}</span>
                  </div>
                )}
                
                {player.stats.economy && (
                  <div className="flex justify-between">
                    <span className="text-gray-950">Economy:</span>
                    <span className="font-semibold">{player.stats.economy}</span>
                  </div>
                )}
                
                {player.stats.centuries && (
                  <div className="flex justify-between">
                    <span className="text-gray-950">Centuries:</span>
                    <span className="font-semibold">{player.stats.centuries}</span>
                  </div>
                )}
                
                {player.stats.halfCenturies && (
                  <div className="flex justify-between">
                    <span className="text-gray-950">Half Centuries:</span>
                    <span className="font-semibold">{player.stats.halfCenturies}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Career Highlights */}
        {player.career_highlights && player.career_highlights.length > 0 && (
          <div className="border-t pt-4 mt-4 ">
            <h4 className="font-semibold  mb-2">Career Highlights</h4>
            <div className="space-y-1 text-black">
              {player.career_highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="text-sm text-gray-900 flex items-start">
                  <span className="text-cricket-primary mr-2">•</span>
                  <span className="line-clamp-2">{highlight}</span>
                </div>
              ))}
              {player.career_highlights.length > 2 && (
                <div className="text-xs text-cricket-primary">
                  +{player.career_highlights.length - 2} more highlights
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex space-x-2">
            <button className="flex-1 bg-cricket-primary text-black py-2 px-4 rounded-lg text-sm font-semibold hover:bg-cricket-secondary transition-colors duration-200 btn-hover">
              View Details
            </button>
            <button className="flex-1 border border-cricket-primary text-cricket-primary py-2 px-4 rounded-lg text-sm font-semibold hover:bg-cricket-primary hover:text-white transition-colors duration-200">
              Related Quizzes
            </button>
          </div>
        </div>
      </div>
      
    </div>
   
  )}
    




export default PlayerCard