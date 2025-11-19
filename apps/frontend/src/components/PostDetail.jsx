import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postService } from '../services/postService'
import { commentService } from '../services/commentService'
import './PostDetail.css'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    try {
      const data = await postService.getById(id)
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const data = await commentService.getByPostId(id)
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      setSubmitting(true)
      const newComment = await commentService.create({
        postId: id,
        author: 'user1', // TODO: Get from auth context
        content: commentText
      })
      setComments([...comments, newComment])
      setCommentText('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !post) {
    return (
      <div className="post-detail">
        <div className="loading">Loading post...</div>
      </div>
    )
  }

  return (
    <div className="post-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      
      <article className="post-content">
        <div className="post-header">
          <span className="post-category">{post.category}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-author">By {post.author}</span>
          <div className="post-tags">
            {post.tags && post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
        
        <div className="post-body">
          <p>{post.content}</p>
        </div>
      </article>

      <section className="comments-section">
        <h2 className="comments-title">Comments ({comments.length})</h2>
        
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
            rows="3"
          />
          <button 
            type="submit" 
            className="submit-comment-btn"
            disabled={submitting || !commentText.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default PostDetail

