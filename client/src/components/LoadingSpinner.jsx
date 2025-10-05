import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cricket-light to-white">
      <div className="text-center">
        <div className="relative">
          {/* Spinning cricket ball */}
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cricket-primary to-cricket-secondary flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏏</span>
            </div>
          </div>
          
          {/* Bouncing dots */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-cricket-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-cricket-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cricket-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-cricket-primary mb-2">
          Loading Cricket Quiz...
        </h2>
        <p className="text-gray-600">
          Preparing your ultimate cricket experience
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner