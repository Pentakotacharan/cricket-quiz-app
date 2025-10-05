import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    favoriteTeam: '',
    favoritePlayer: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, error, clearError } = useApp()
  const navigate = useNavigate()

  const teams = [
    'India', 'Australia', 'England', 'South Africa', 'New Zealand',
    'Pakistan', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return
    }

    setIsLoading(true)

    const { confirmPassword, ...registrationData } = formData
    const result = await register(registrationData)
    
    setIsLoading(false)
    
    if (result.success) {
      navigate('/')
    }
  }

  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cricket-light to-cricket-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-cyan-400 to-90% ... rounded-xl shadow-2xl p-8 text-gray-950">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-cricket-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🏏</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join the Team!
            </h2>
            <p className="text-gray-600">
              Create your account to start learning cricket
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent ${
                    !passwordsMatch ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {!passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <div>
                <label htmlFor="favoriteTeam" className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Team
                </label>
                <select
                  id="favoriteTeam"
                  name="favoriteTeam"
                  value={formData.favoriteTeam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                >
                  <option value="">Select your favorite team</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="favoritePlayer" className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Player (Optional)
                </label>
                <input
                  id="favoritePlayer"
                  name="favoritePlayer"
                  type="text"
                  value={formData.favoritePlayer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                  placeholder="Enter your favorite player"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-black bg-cricket-primary hover:bg-cricket-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cricket-primary transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-cricket-primary hover:text-cricket-secondary transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register