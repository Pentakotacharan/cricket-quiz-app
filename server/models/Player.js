const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  matches: {
    type: Number,
    default: 0
  },
  runs: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  average: {
    type: Number,
    default: 0
  },
  strikeRate: {
    type: Number,
    default: 0
  },
  economy: {
    type: Number,
    default: 0
  },
  centuries: {
    type: Number,
    default: 0
  },
  halfCenturies: {
    type: Number,
    default: 0
  },
  bestBowling: {
    type: String,
    default: ''
  },
  catches: {
    type: Number,
    default: 0
  }
})

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  placeOfBirth: {
    type: String,
    trim: true
  },
  stats: statsSchema,
  career_highlights: [{
    type: String,
    trim: true
  }],
  image_url: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  debutYear: {
    type: Number
  },
  retirementYear: {
    type: Number
  },
  battingStyle: {
    type: String,
    enum: ['Right-handed', 'Left-handed'],
    trim: true
  },
  bowlingStyle: {
    type: String,
    enum: ['Right-arm fast', 'Left-arm fast', 'Right-arm medium', 'Left-arm medium', 'Right-arm off-break', 'Right-arm leg-break', 'Left-arm orthodox', 'Left-arm chinaman'],
    trim: true
  },
  formats: [{
    type: String,
    enum: ['Test', 'ODI', 'T20I', 'IPL', 'Domestic']
  }]
}, {
  timestamps: true
})

// Text search index
playerSchema.index({
  name: 'text',
  team: 'text',
  country: 'text'
})

// Other indexes for better query performance
playerSchema.index({ country: 1 })
playerSchema.index({ team: 1 })
playerSchema.index({ role: 1 })
playerSchema.index({ isActive: 1 })
playerSchema.index({ 'stats.runs': -1 })
playerSchema.index({ 'stats.wickets': -1 })

module.exports = mongoose.model('Player', playerSchema)