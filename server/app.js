const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
// const rateLimit = require('express-rate-limit')

// Route imports
const quizRoutes = require('./routes/quizRoutes')
const playerRoutes = require('./routes/playerRoutes')
const userRoutes = require('./routes/userRoutes')

// Create Express app
const app = express()


// Security middleware
app.use(helmet())


const allowedOrigins = [
            // frontend dev
           // Vite
  'https://cricket-quizapp.vercel.app/'         // some setups
  // add other local origins you'd use
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl).
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Block other origins.
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// })

// app.use('/api/', limiter)

// Stricter rate limiting for authentication routes
// const authLimiter = rateLimit({
//   windowMs: 0.5 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 5 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// })

// app.use('/api/users/login', authLimiter)
// app.use('/api/users/register', authLimiter)

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// API routes
app.use('/api/quizzes', quizRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/users', userRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cricket Quiz API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Cricket Quiz & Learning API',
    version: '1.0.0',
    documentation: '/api/health'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)

  let statusCode = 500
  let message = 'Internal Server Error'

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(error.errors).map(val => val.message).join(', ')
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400
    const field = Object.keys(error.keyValue)[0]
    message = `${field} already exists`
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = 400
    message = 'Resource not found'
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // CORS error
  if (error.message && error.message.includes('CORS')) {
    statusCode = 403
    message = 'CORS policy violation'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

module.exports = app