import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import PlayerCard from '../components/PlayerCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Players = () => {
  const { players, fetchPlayers, loading } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    filterPlayers()
  }, [players, searchTerm, selectedRole, selectedCountry])

  const filterPlayers = () => {
    let filtered = [...players]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(player => player.role === selectedRole)
    }

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(player => player.country === selectedCountry)
    }

    setFilteredPlayers(filtered)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRole('')
    setSelectedCountry('')
  }

  // Get unique roles and countries for filter options
  const roles = [...new Set(players.map(player => player.role))].sort()
  const countries = [...new Set(players.map(player => player.country))].sort()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cricket-light to-amber-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cricket-primary mb-4">
            Cricket Players Database 🏏
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore detailed profiles of cricket legends and current stars. 
            Learn about their achievements, statistics, and career highlights.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players, teams..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-900">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-primary focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {(searchTerm || selectedRole || selectedCountry) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-cricket-primary border border-cricket-primary rounded-lg hover:bg-cricket-primary hover:text-amber-400 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPlayers.length} of {players.length} players
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Players Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedRole || selectedCountry 
                ? "Try adjusting your search criteria or filters"
                : "No players available in the database"
              }
            </p>
            {(searchTerm || selectedRole || selectedCountry) && (
              <button
                onClick={clearFilters}
                className="bg-cricket-primary text-black px-6 py-2 rounded-lg hover:bg-cricket-secondary transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
        )}

        {/* Load More Button (for pagination if needed) */}
        {players.length > 20 && filteredPlayers.length >= 20 && (
          <div className="text-center mt-12">
            <button className="bg-cricket-primary text-black px-8 py-3 rounded-lg hover:bg-cricket-secondary transition-colors duration-200 font-semibold">
              Load More Players
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Players