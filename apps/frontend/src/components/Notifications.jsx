import React, { useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'
import { userService } from '../services/userService'
import './Notifications.css'

function Notifications() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentUser = userService.getCurrentUser()
  const userId = currentUser?.id || 'user1' // Default to user1 for MVP

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications(userId)
      setNotifications(data)
      setError(null)
    } catch (err) {
      setError('Failed to load notifications')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId)
      fetchNotifications()
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      fetchNotifications()
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  if (loading) {
    return (
      <div className="notifications">
        <div className="loading">Loading notifications...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="notifications">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchNotifications} className="retry-btn">Retry</button>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h1 className="notifications-title">You have {unreadCount} unread notifications</h1>
        <div className="notifications-tabs">
          <button 
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>
        <button className="mark-all-read" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">No notifications found</div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              style={{ cursor: !notification.read ? 'pointer' : 'default' }}
            >
              {!notification.read && <div className="unread-dot"></div>}
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(notification.metadata?.commentAuthor || 'User')}&background=6366f1&color=fff`}
                alt="User"
                className="notification-avatar"
              />
              <div className="notification-content">
                <div className="notification-text">
                  {notification.message}
                  {notification.metadata?.commentContent && (
                    <div className="notification-comment">"{notification.metadata.commentContent}..."</div>
                  )}
                </div>
                <div className="notification-date">{formatDate(notification.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications

