const dotenv = require('dotenv')
const app = require('./app')
const cors=require('cors');
app.use(cors());
const connectDB = require('./config/db')

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
  console.error('Stack trace:', err.stack)
  process.exit(1)
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🚀 Cricket Quiz API Server running on port ${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`)
  console.log('📋 Available endpoints:')
  console.log('   - GET  /api/health (Health check)')
  console.log('   - POST /api/users/register (User registration)')
  console.log('   - POST /api/users/login (User login)')
  console.log('   - GET  /api/users/profile (Get user profile)')
  console.log('   - GET  /api/users/leaderboard (Get leaderboard)')
  console.log('   - GET  /api/quizzes (Get all quizzes)')
  console.log('   - GET  /api/quizzes/:id (Get specific quiz)')
  console.log('   - POST /api/quizzes/:id/submit (Submit quiz answers)')
  console.log('   - GET  /api/players (Get all players)')
  console.log('   - GET  /api/players/search (Search players)')
  console.log('🏏 Ready to serve cricket quiz enthusiasts!')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message)
  console.error('Stack trace:', err.stack)
  console.log('Shutting down server due to unhandled promise rejection...')
  
  server.close(() => {
    process.exit(1)
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...')
  
  server.close(() => {
    console.log('💤 Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...')
  
  server.close(() => {
    console.log('💤 Process terminated')
    process.exit(0)
  })
})

module.exports = server