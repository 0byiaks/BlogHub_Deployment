import axios from 'axios'

const API_URL = '/api/users'

export const userService = {
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData)
      return response.data
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials)
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  async getAll() {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem('token')
  }
}

