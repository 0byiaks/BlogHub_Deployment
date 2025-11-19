import React, { useState } from 'react'
import { postService } from '../services/postService'
import { useNavigate } from 'react-router-dom'
import './CreatePost.css'

function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Design',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const categories = ['Design', 'UX', 'Development', 'Startups', 'AI', 'Other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setSubmitting(true)
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const postData = {
        ...formData,
        tags: tagsArray,
        author: 'user1' // TODO: Get from auth context
      }

      const newPost = await postService.create(postData)
      navigate(`/post/${newPost.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-post">
      <h1 className="create-post-title">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="post-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title..."
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            className="form-textarea"
            rows="12"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="design, ux, trends"
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost

