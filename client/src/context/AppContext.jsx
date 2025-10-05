import React, { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AppContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  quizzes: [],
  players: [],
  leaderboard: [],
  currentQuiz: null,
  quizResults: null,
  userBadges: [],
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    
    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload }
    
    case 'SET_PLAYERS':
      return { ...state, players: action.payload }
    
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload }
    
    case 'SET_CURRENT_QUIZ':
      return { ...state, currentQuiz: action.payload }
    
    case 'SET_QUIZ_RESULTS':
      return { ...state, quizResults: action.payload }
    
    case 'SET_USER_BADGES':
      return { ...state, userBadges: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...initialState,
        token: null,
        loading: false
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Set auth token for API requests
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [state.token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (state.token) {
          const response = await api.get('/users/profile')
          console.log(response.data);
          dispatch({ type: 'SET_USER', payload: response.data.data.user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        dispatch({ type: 'LOGOUT' })
      }
    }

    checkAuth()
  }, [state.token])

  // Auth actions
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await api.post('/users/login', credentials)
      console.log(response.data)
      const { token, user } = response.data.data
       console.log(token);
      localStorage.setItem('token', token)
      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_USER', payload: user })
      
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await api.post('/users/register', userData)
      const { token, user } = response.data.data
      
      localStorage.setItem('token', token)
      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_USER', payload: user })
      
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  // Quiz actions
  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes')
      dispatch({ type: 'SET_QUIZZES', payload: response.data.data.quizzes })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch quizzes' })
    }
  }

  const fetchQuiz = async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}`)
      dispatch({ type: 'SET_CURRENT_QUIZ', payload: response.data.data.quiz })
      return response.data.data.quiz
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch quiz' })
      return null
    }
  }

  const submitQuiz = async (quizId, answers) => {
    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, { answers })
      dispatch({ type: 'SET_QUIZ_RESULTS', payload: response.data.data.results })
      return response.data.data.results
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit quiz' })
      return null
    }
  }

  // Player actions
  const fetchPlayers = async (searchTerm = '') => {
    try {
      const response = await api.get(`/players${searchTerm ? `?search=${searchTerm}` : ''}`)
      dispatch({ type: 'SET_PLAYERS', payload: response.data.data.players })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch players' })
    }
  }

  // Leaderboard actions
  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard')
      dispatch({ type: 'SET_LEADERBOARD', payload: response.data.data.leaderboard })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch leaderboard' })
    }
  }

  // Badge actions
  const fetchUserBadges = async () => {
    try {
      const response = await api.get('/users/badges')
      dispatch({ type: 'SET_USER_BADGES', payload: response.data.data.badges })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch badges' })
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    fetchQuizzes,
    fetchQuiz,
    submitQuiz,
    fetchPlayers,
    fetchLeaderboard,
    fetchUserBadges,
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}