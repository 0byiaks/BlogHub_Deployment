import React from 'react'
import './RightSidebar.css'

function RightSidebar() {
  const usersToFollow = [
    {
      name: 'Sarah Chen',
      username: '@sarahchen',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8b5cf6&color=fff'
    },
    {
      name: 'Marcus Johnson',
      username: '@marcusj',
      avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=6366f1&color=fff'
    },
    {
      name: 'Emma Rodriguez',
      username: '@emmarodriguez',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=ef4444&color=fff'
    }
  ]

  const popularTags = [
    '#Design',
    '#Development',
    '#AI',
    '#Startups',
    '#UX'
  ]

  return (
    <aside className="right-sidebar">
      <div className="sidebar-card">
        <h3 className="card-title">Who to Follow</h3>
        <div className="users-list">
          {usersToFollow.map((user, index) => (
            <div key={index} className="user-item">
              <img src={user.avatar} alt={user.name} className="user-avatar-small" />
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-username">{user.username}</div>
              </div>
              <button className="follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-card">
        <h3 className="card-title">Popular Tags</h3>
        <div className="tags-list">
          {popularTags.map(tag => (
            <button key={tag} className="tag-btn">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar

