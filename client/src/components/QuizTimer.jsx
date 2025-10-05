import React, { useState, useEffect } from 'react'

const QuizTimer = ({ timeRemaining, onTimeUp, paused = false }) => {
  const [time, setTime] = useState(timeRemaining)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTime(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        
        const newTime = prevTime - 1
        
        // Show warning when less than 30 seconds remaining
        if (newTime <= 30 && !isWarning) {
          setIsWarning(true)
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paused, onTimeUp, isWarning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((timeRemaining - time) / timeRemaining) * 100
  }

  const getTimerColor = () => {
    if (time <= 30) return 'text-red-600'
    if (time <= 60) return 'text-orange-600'
    return 'text-cricket-primary'
  }

  const getProgressColor = () => {
    if (time <= 30) return 'bg-red-500'
    if (time <= 60) return 'bg-orange-500'
    return 'bg-cricket-primary'
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Timer Display */}
      <div className={`flex items-center space-x-2 ${getTimerColor()} ${isWarning ? 'animate-pulse' : ''}`}>
        <div className="text-xl">⏱️</div>
        <div className="font-mono text-lg font-semibold">
          {formatTime(time)}
        </div>
      </div>

      {/* Progress Circle */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${getProgressPercentage()}, 100`}
            className={getProgressColor().replace('bg-', 'text-')}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold ${getTimerColor()}`}>
            {Math.ceil((time / timeRemaining) * 100)}%
          </span>
        </div>
      </div>

      {/* Warning indicator */}
      {isWarning && (
        <div className="text-red-500 animate-bounce">
          ⚠️
        </div>
      )}
    </div>
  )
}

export default QuizTimer