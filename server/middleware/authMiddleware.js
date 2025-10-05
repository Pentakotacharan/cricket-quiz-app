const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
     console.log(token)
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')

      // Get user from token and add to request
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        })
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        })
      }

      next()
    } catch (error) {
      console.error('Token verification error:', error)
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        })
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }
}

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in request'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      })
    }

    next()
  }
}

// Optional authentication - adds user to request if token is valid, but doesn't block access
const optionalAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      // Silently fail - user remains undefined
      console.log('Optional auth failed:', error.message)
    }
  }

  next()
}

module.exports = {
  protect,
  authorize,
  optionalAuth
}