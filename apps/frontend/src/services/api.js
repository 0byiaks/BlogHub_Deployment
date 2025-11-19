import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instances for each service
const postApi = axios.create({
  baseURL: `${API_BASE_URL}/api/posts`,
  headers: {
    'Content-Type': 'application/json'
  }
})

const commentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/comments`,
  headers: {
    'Content-Type': 'application/json'
  }
})

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Post Service API
export const postService = {
  getAll: (params = {}) => postApi.get('', { params }),
  getById: (id) => postApi.get(`/${id}`),
  create: (data) => postApi.post('', data),
  update: (id, data) => postApi.put(`/${id}`, data),
  delete: (id) => postApi.delete(`/${id}`),
  search: (query) => postApi.get('', { params: { search: query } }),
  getByCategory: (category) => postApi.get('', { params: { category } })
}

// Comment Service API
export const commentService = {
  getByPostId: (postId) => commentApi.get(`/post/${postId}`),
  create: (data) => commentApi.post('', data),
  update: (id, data) => commentApi.put(`/${id}`, data),
  delete: (id) => commentApi.delete(`/${id}`)
}

// User Service API
export const userService = {
  register: (data) => userApi.post('/register', data),
  login: (data) => userApi.post('/login', data),
  getById: (id) => userApi.get(`/${id}`),
  getAll: () => userApi.get('')
}

export default {
  post: postService,
  comment: commentService,
  user: userService
}

