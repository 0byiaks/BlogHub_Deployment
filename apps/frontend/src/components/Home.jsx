import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services/postService'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await postService.getAll()
      setPosts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load posts. Make sure the backend services are running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="home">
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchPosts} className="retry-btn">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <h1 className="home-title">Latest Posts</h1>
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">No posts found. Create your first post!</div>
        ) : (
          posts.map(post => (
            <Link key={post.id} to={`/post/${post.id}`} className="post-card-link">
              <div className="post-card">
                <div className="post-header">
                  <div className="post-category">{post.category}</div>
                  <div className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <div className="post-footer">
                  <div className="post-tags">
                    {post.tags && post.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="post-author">By {post.author}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Home

