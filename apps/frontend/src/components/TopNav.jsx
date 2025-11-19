import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '../services/notificationService'
import { userService } from '../services/userService'
import './TopNav.css'

function TopNav({ onWriteClick }) {
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  const currentUser = userService.getCurrentUser()
  const userId = currentUser?.id || 'user1' // Default to user1 for MVP

  useEffect(() => {
    fetchUnreadCount()
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleWrite = () => {
    if (onWriteClick) {
      onWriteClick()
    } else {
      navigate('/create')
    }
  }

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-left">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">✦</div>
            <span className="logo-text">BlogHub</span>
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search posts, topics, or people..." 
              className="search-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate('/explore')
                }
              }}
            />
          </div>
        </div>
        <div className="nav-right">
          <button className="write-btn" onClick={handleWrite}>
            <span className="write-icon">✏️</span>
            Write
          </button>
          <div className="notification-icon" onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }}>
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </div>
          <div className="user-avatar" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="User" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav
