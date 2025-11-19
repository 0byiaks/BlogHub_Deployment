import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (section) => {
    setActiveSection(section)
    const routes = {
      home: '/',
      explore: '/explore',
      notifications: '/notifications',
      bookmarks: '/bookmarks',
      profile: '/profile',
      trending: '/trending',
      settings: '/settings'
    }
    if (routes[section]) {
      navigate(routes[section])
    }
  }
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'explore', label: 'Explore', icon: '🧭' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const trendingTopics = [
    '#Design Systems',
    '#AI Tools',
    '#Remote Work',
    '#Web3',
    '#Accessibility'
  ]

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${location.pathname === (item.id === 'home' ? '/' : `/${item.id}`) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="trending-section">
        <h3 className="trending-title">Trending Topics</h3>
        <div className="trending-tags">
          {trendingTopics.map(tag => (
            <button key={tag} className="trending-tag">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

