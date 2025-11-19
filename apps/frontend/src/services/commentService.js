import axios from 'axios'

const API_URL = '/api/comments'

export const commentService = {
  async getByPostId(postId) {
    try {
      const response = await axios.get(`${API_URL}/post/${postId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  },

  async create(commentData) {
    try {
      const response = await axios.post(API_URL, commentData)
      return response.data
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  async update(id, commentData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, commentData)
      return response.data
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }
}

