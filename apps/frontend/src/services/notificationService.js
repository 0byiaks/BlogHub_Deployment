import axios from 'axios'

const API_URL = '/api/notifications'

export const notificationService = {
  async getUserNotifications(userId) {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  async getUnreadCount(userId) {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}/unread-count`)
      return response.data.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${API_URL}/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  async markAllAsRead(userId) {
    try {
      const response = await axios.put(`${API_URL}/user/${userId}/read-all`)
      return response.data
    } catch (error) {
      console.error('Error marking all as read:', error)
      throw error
    }
  },

  async create(notificationData) {
    try {
      const response = await axios.post(API_URL, notificationData)
      return response.data
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }
}

