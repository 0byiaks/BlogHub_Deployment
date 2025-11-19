import React, { useState, useEffect } from 'react'
import { postService } from '../services/postService'
import { Link } from 'react-router-dom'
import './Explore.css'

function Explore() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Design', 'UX', 'Development', 'Startups', 'AI']

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await postService.getAll()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts()
      return
    }

    try {
      setLoading(true)
      const data = await postService.search(searchQuery)
      setPosts(data)
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory)

  return (
    <div className="explore">
      <h1 className="explore-title">Explore Posts</h1>

      <div className="explore-filters">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search posts..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="no-results">No posts found</div>
          ) : (
            filteredPosts.map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="post-card-link">
                <div className="post-card">
                  <div className="post-header">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                  <div className="post-footer">
                    <span className="post-author">By {post.author}</span>
                    <div className="post-tags">
                      {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Explore

