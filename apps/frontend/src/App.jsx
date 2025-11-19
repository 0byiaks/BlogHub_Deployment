import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Home from './components/Home'
import Explore from './components/Explore'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'
import Login from './components/Login'
import Register from './components/Register'
import Notifications from './components/Notifications'
import Profile from './components/Profile'
import Settings from './components/Settings'
import RightSidebar from './components/RightSidebar'

function AppContent() {
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()

  const handleWriteClick = () => {
    navigate('/create')
  }

  return (
    <div className="app">
      <TopNav onWriteClick={handleWriteClick} />
      <div className="app-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/bookmarks" element={<div className="coming-soon">Bookmarks - Coming Soon</div>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trending" element={<div className="coming-soon">Trending - Coming Soon</div>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <RightSidebar />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
