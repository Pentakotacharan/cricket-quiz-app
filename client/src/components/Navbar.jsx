import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-blue-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cricket-primary rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-black">🏏</span>
            </div>
            <div className=" sm:block">
              <h1 className="text-xl font-bold text-cricket-primary">
                Cricket Quiz
              </h1>
              <p className="text-xs text-black">Learn & Compete</p>
            </div>
          </Link>

          {/* Navigation Links */}
          {user ? (
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <div className="text-black md:flex items-center space-x-6">
                <Link
                  to="/"
                  style={{ color: 'black' }}
                  className="text-black hover:text-black transition-colors duration-200 font-medium">
                  Home
                </Link>
                <Link
                  to="/players"
                  style={{ color: 'black' }}
                  className="text-black hover:text-black transition-colors duration-200 font-medium"
                >
                  Players
                </Link>
                <Link
                  to="/leaderboard"
                  style={{ color: 'black' }}
                  className="text-black hover:text-black transition-colors duration-200 font-medium"
                >
                  Leaderboard
                </Link>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* User Stats */}
                <div className="hidden lg:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-cricket-primary font-semibold">
                      {user.totalPoints || 0}
                    </span>
                    <span className="text-gray-600">pts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-cricket-secondary font-semibold">
                      Lv.{user.level || 1}
                    </span>
                  </div>
                  {user.streak && user.streak > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-orange-500">🔥</span>
                      <span className="text-orange-500 font-semibold">
                        {user.streak}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-cricket-primary text-white px-4 py-2 rounded-lg hover:bg-cricket-secondary transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block font-medium">
                    {user.username}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => handleLogout()}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 p-2"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Guest Navigation */
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-cricket-primary transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-cricket-primary text-white px-6 py-2 rounded-lg hover:bg-cricket-secondary transition-colors duration-200 font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu (if user is logged in) */}
      {user && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              
              className="block px-3 py-2  hover:text-cricket-primary hover:bg-cricket-light rounded-md transition-colors duration-200"
            >
              🏠 Home
            </Link>
            <Link
              to="/players"
              className="block px-3 py-2 text-gray-700 hover:text-cricket-primary hover:bg-cricket-light rounded-md transition-colors duration-200"
            >
              👥 Players
            </Link>
            <Link
              to="/leaderboard"
              className="block px-3 py-2 text-gray-700 hover:text-cricket-primary hover:bg-cricket-light rounded-md transition-colors duration-200"
            >
              🏆 Leaderboard
            </Link>
            
            {/* Mobile User Stats */}
            <div className="px-3 py-2 text-sm text-gray-600 border-t">
              <div className="flex justify-between items-center">
                <span>Points: <span className="font-semibold text-cricket-primary">{user.totalPoints || 0}</span></span>
                <span>Level: <span className="font-semibold text-cricket-secondary">{user.level || 1}</span></span>
                {user.streak && user.streak > 0 && (
                  <span>Streak: <span className="font-semibold text-orange-500">🔥{user.streak}</span></span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar