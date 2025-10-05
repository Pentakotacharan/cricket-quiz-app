import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Players from './pages/Players'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useApp()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {user ? (
              <>
                <Route path="/quiz/:id?" element={<Quiz />} />
                <Route path="/players" element={<Players />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : (
              <Route path="*" element={<Login />} />
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App