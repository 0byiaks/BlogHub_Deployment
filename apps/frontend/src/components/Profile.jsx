import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { commentService } from '../services/commentService'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    totalLikes: 0
  })

  const currentUser = userService.getCurrentUser()
  const userId = currentUser?.id || 'user1'

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Fetch user info
      const userData = await userService.getById(userId)
      setUser(userData)

      // Fetch all posts and filter by user
      const allPosts = await postService.getAll()
      const myPosts = allPosts.filter(post => post.author === userId)
      setUserPosts(myPosts)
      setStats(prev => ({ ...prev, posts: myPosts.length }))

      // Fetch all comments and filter by user
      const allComments = await commentService.getByPostId('1') // Get comments for first post as example
      // In a real app, we'd need a way to get all comments by a user
      setStats(prev => ({ ...prev, comments: allComments.filter(c => c.author === userId).length }))
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="profile">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&size=120&background=6366f1&color=fff`}
            alt={user?.username}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.username || 'User'}</h1>
          <p className="profile-email">{user?.email || 'user@example.com'}</p>
          <span className="profile-role">{user?.role || 'Reader'}</span>
        </div>
        <button 
          className="edit-profile-btn"
          onClick={() => navigate('/settings')}
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-number">{stats.posts}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.comments}</div>
          <div className="stat-label">Comments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.totalLikes}</div>
          <div className="stat-label">Likes Received</div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({userPosts.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({stats.comments})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            {userPosts.length === 0 ? (
              <div className="empty-state">
                <p>No posts yet. Start writing to share your thoughts!</p>
                <button 
                  className="create-post-btn"
                  onClick={() => navigate('/create')}
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="posts-grid">
                {userPosts.map(post => (
                  <div 
                    key={post.id} 
                    className="post-card"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    <div className="post-header">
                      <span className="post-category">{post.category}</span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                    <div className="post-tags">
                      {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-section">
            <div className="empty-state">
              <p>Comment history will be displayed here</p>
              <p className="sub-text">Start commenting on posts to see them here!</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-card">
              <h3>About</h3>
              <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
              <p>Role: <strong>{user?.role || 'Reader'}</strong></p>
            </div>
            <div className="about-card">
              <h3>Activity</h3>
              <p>Total Posts: <strong>{stats.posts}</strong></p>
              <p>Total Comments: <strong>{stats.comments}</strong></p>
              <p>Likes Received: <strong>{stats.totalLikes}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

