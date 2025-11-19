import axios from 'axios'

const API_URL = '/api/posts'

export const postService = {
  async getAll() {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  },

  async create(postData) {
    try {
      const response = await axios.post(API_URL, postData)
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  async update(id, postData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, postData)
      return response.data
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  },

  async search(query) {
    try {
      const response = await axios.get(API_URL, { params: { search: query } })
      return response.data
    } catch (error) {
      console.error('Error searching posts:', error)
      throw error
    }
  }
}

