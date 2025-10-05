const express = require('express')
const router = express.Router()
const {
  getPlayers,
  getPlayer,
  searchPlayers,
  getPlayersByTeam,
  getPlayerStats,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Protected routes (all require authentication)
router.use(protect)

router.route('/')
  .get(getPlayers)
  .post(authorize('admin'), createPlayer) // Admin only

router.get('/search', searchPlayers)
router.get('/stats', getPlayerStats)
router.get('/team/:team', getPlayersByTeam)

router.route('/:id')
  .get(getPlayer)
  .put(authorize('admin'), updatePlayer) // Admin only
  .delete(authorize('admin'), deletePlayer) // Admin only

module.exports = router