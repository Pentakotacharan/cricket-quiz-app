const Player = require('../models/Player')
const Joi = require('joi')

// Validation schemas
const createPlayerSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  team: Joi.string().required().trim().min(2).max(100),
  country: Joi.string().required().trim().min(2).max(50),
  role: Joi.string().valid('Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper').required(),
  dateOfBirth: Joi.date(),
  placeOfBirth: Joi.string().trim().max(100),
  stats: Joi.object({
    matches: Joi.number().min(0),
    runs: Joi.number().min(0),
    wickets: Joi.number().min(0),
    average: Joi.number().min(0),
    strikeRate: Joi.number().min(0),
    economy: Joi.number().min(0),
    centuries: Joi.number().min(0),
    halfCenturies: Joi.number().min(0),
    bestBowling: Joi.string().trim(),
    catches: Joi.number().min(0)
  }),
  career_highlights: Joi.array().items(Joi.string().trim().max(500)),
  image_url: Joi.string().trim().uri(),
  isActive: Joi.boolean(),
  debutYear: Joi.number().min(1800).max(new Date().getFullYear()),
  retirementYear: Joi.number().min(1800).max(new Date().getFullYear()),
  battingStyle: Joi.string().valid('Right-handed', 'Left-handed'),
  bowlingStyle: Joi.string().valid('Right-arm fast', 'Left-arm fast', 'Right-arm medium', 'Left-arm medium', 'Right-arm off-break', 'Right-arm leg-break', 'Left-arm orthodox', 'Left-arm chinaman'),
  formats: Joi.array().items(Joi.string().valid('Test', 'ODI', 'T20I', 'IPL', 'Domestic'))
})

// @desc    Get all players
// @route   GET /api/players
// @access  Private
const getPlayers = async (req, res) => {
  try {
    const {
      search,
      country,
      team,
      role,
      isActive,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query

    const query = {}

    // Text search across name, team, and country
    if (search) {
      query.$text = { $search: search }
    }

    // Filter by country
    if (country) {
      query.country = country
    }

    // Filter by team
    if (team) {
      query.team = team
    }

    // Filter by role
    if (role) {
      query.role = role
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'
    }

    const skip = (page - 1) * limit

    // Build sort object
    const sortObj = {}
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1

    const players = await Player.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Player.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        players,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get players error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching players'
    })
  }
}

// @desc    Get single player
// @route   GET /api/players/:id
// @access  Private
const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        player
      }
    })
  } catch (error) {
    console.error('Get player error:', error)

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid player ID'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching player'
    })
  }
}

// @desc    Search players
// @route   GET /api/players/search
// @access  Private
const searchPlayers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      })
    }

    const players = await Player.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .select('name team country role isActive image_url stats.runs stats.wickets')

    res.status(200).json({
      success: true,
      data: {
        players,
        count: players.length
      }
    })
  } catch (error) {
    console.error('Search players error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while searching players'
    })
  }
}

// @desc    Get players by team
// @route   GET /api/players/team/:team
// @access  Private
const getPlayersByTeam = async (req, res) => {
  try {
    const { team } = req.params
    const { isActive } = req.query

    const query = { team: new RegExp(team, 'i') }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true'
    }

    const players = await Player.find(query)
      .sort({ name: 1 })
      .select('name role isActive image_url stats.runs stats.wickets')

    res.status(200).json({
      success: true,
      data: {
        team,
        players,
        count: players.length
      }
    })
  } catch (error) {
    console.error('Get players by team error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team players'
    })
  }
}

// @desc    Get player statistics
// @route   GET /api/players/stats
// @access  Private
const getPlayerStats = async (req, res) => {
  try {
    const stats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalPlayers: { $sum: 1 },
          activePlayers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalRuns: { $sum: '$stats.runs' },
          totalWickets: { $sum: '$stats.wickets' },
          countries: { $addToSet: '$country' },
          teams: { $addToSet: '$team' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPlayers: 1,
          activePlayers: 1,
          retiredPlayers: { $subtract: ['$totalPlayers', '$activePlayers'] },
          totalRuns: 1,
          totalWickets: 1,
          totalCountries: { $size: '$countries' },
          totalTeams: { $size: '$teams' }
        }
      }
    ])

    // Get role distribution
    const roleStats = await Player.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    // Get top performers
    const topBatsmen = await Player.find({ 'stats.runs': { $gt: 0 } })
      .sort({ 'stats.runs': -1 })
      .limit(5)
      .select('name team stats.runs')

    const topBowlers = await Player.find({ 'stats.wickets': { $gt: 0 } })
      .sort({ 'stats.wickets': -1 })
      .limit(5)
      .select('name team stats.wickets')

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPlayers: 0,
          activePlayers: 0,
          retiredPlayers: 0,
          totalRuns: 0,
          totalWickets: 0,
          totalCountries: 0,
          totalTeams: 0
        },
        roleDistribution: roleStats,
        topPerformers: {
          batsmen: topBatsmen,
          bowlers: topBowlers
        }
      }
    })
  } catch (error) {
    console.error('Get player stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching player statistics'
    })
  }
}

// @desc    Create new player (Admin only)
// @route   POST /api/players
// @access  Private/Admin
const createPlayer = async (req, res) => {
  try {
    const { error, value } = createPlayerSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    // Check if player with same name and team already exists
    const existingPlayer = await Player.findOne({
      name: new RegExp(`^${value.name}$`, 'i'),
      team: value.team
    })

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: 'Player with this name already exists in the team'
      })
    }

    const player = await Player.create(value)

    res.status(201).json({
      success: true,
      data: {
        player
      }
    })
  } catch (error) {
    console.error('Create player error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating player'
    })
  }
}

// @desc    Update player (Admin only)
// @route   PUT /api/players/:id
// @access  Private/Admin
const updatePlayer = async (req, res) => {
  try {
    const { error, value } = createPlayerSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    )

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        player
      }
    })
  } catch (error) {
    console.error('Update player error:', error)

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid player ID'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating player'
    })
  }
}

// @desc    Delete player (Admin only)
// @route   DELETE /api/players/:id
// @access  Private/Admin
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id)

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Player deleted successfully'
    })
  } catch (error) {
    console.error('Delete player error:', error)

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid player ID'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting player'
    })
  }
}

module.exports = {
  getPlayers,
  getPlayer,
  searchPlayers,
  getPlayersByTeam,
  getPlayerStats,
  createPlayer,
  updatePlayer,
  deletePlayer
}